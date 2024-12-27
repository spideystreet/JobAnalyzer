import logging
import unicodedata
from typing import Dict, Any, List
import json

logger = logging.getLogger(__name__)

class JobTransformer:
    # Liste des acronymes à ne pas modifier
    TECH_ACRONYMS = {'GCP', 'AWS', 'SQL', 'API', 'ETL', 'CLI', 'SDK'}
    
    # Mapping de standardisation des technos
    TECH_MAPPING = {
        # Power BI
        'MICROSOFT_POWERBI': 'POWER_BI',
        'MICROSOFT_POWER_BI': 'POWER_BI',
        'POWERBI': 'POWER_BI',
        
        # Azure
        'MS_AZURE': 'AZURE',
        'MICROSOFT_AZURE': 'AZURE',
        'AZURE_DATABRICKS': 'DATA_BRICKS',
        'AZURE_DATA_FACTORY': 'DATA_FACTORY',
        'AZURE_SYNAPSE': 'SYNAPSE',
        
        # AWS
        'AMAZON_WEB_SERVICES': 'AWS',
        'AWS_S3': 'S3',
        'AMAZON_S3': 'S3',
        'AMAZON_REDSHIFT': 'RED_SHIFT',
        'AWS_REDSHIFT': 'RED_SHIFT',
        'AWS_LAMBDA': 'LAMBDA',
        
        # GCP
        'GOOGLE_CLOUD_PLATFORM': 'GCP',
        'GOOGLE_CLOUD': 'GCP',
        'GOOGLE_BIGQUERY': 'BIG_QUERY',
        'GCP_BIGQUERY': 'BIG_QUERY',
        
        # Bases de données
        'POSTGRESQL': 'POSTGRES',
        'MICROSOFT_SQL_SERVER': 'MS_SQL',
        'MS_SQL_SERVER': 'MS_SQL',
        'MICROSOFT_SQL': 'MS_SQL',
        'MYSQL_DATABASE': 'MYSQL',
        'MONGODB_DATABASE': 'MONGO_DB',
        
        # Python et écosystème
        'PYTHON_PROGRAMMING': 'PYTHON',
        'PANDAS_LIBRARY': 'PANDAS',
        'NUMPY_LIBRARY': 'NUMPY',
        'SCIKIT_LEARN': 'SKLEARN',
        'JUPYTER_NOTEBOOK': 'JUPYTER',
        'JUPYTER_LAB': 'JUPYTER',
        
        # Autres outils Data
        'APACHE_SPARK': 'SPARK',
        'APACHE_AIRFLOW': 'AIRFLOW',
        'APACHE_KAFKA': 'KAFKA',
        'ELASTICSEARCH_DB': 'ELASTICSEARCH',
        'KIBANA_DASHBOARD': 'KIBANA',
        'TABLEAU_SOFTWARE': 'TABLEAU',
        'LOOKER_STUDIO': 'LOOKER',
        
        # Langages
        'JAVASCRIPT_PROGRAMMING': 'JAVASCRIPT',
        'TYPESCRIPT_PROGRAMMING': 'TYPESCRIPT',
        'JAVA_PROGRAMMING': 'JAVA',
        'SCALA_PROGRAMMING': 'SCALA',
        'R_PROGRAMMING': 'R',
        
        # DevOps
        'DOCKER_CONTAINER': 'DOCKER',
        'KUBERNETES_ORCHESTRATION': 'K8S',
        'TERRAFORM_IAC': 'TERRAFORM',
        'GITHUB_ACTIONS': 'GITHUB',
        'GITLAB_CI': 'GITLAB',
        
        # Data Warehouses & Lakes
        'SNOWFLAKE_DW': 'SNOWFLAKE',
        'SNOWFLAKE_CLOUD': 'SNOWFLAKE',
        'DELTA_LAKE': 'DELTA',
        'DATABRICKS_DELTA': 'DELTA',
        'APACHE_HIVE': 'HIVE',
        'APACHE_ICEBERG': 'ICEBERG',
        'APACHE_PARQUET': 'PARQUET',
        'APACHE_AVRO': 'AVRO',
        
        # ETL/ELT Tools
        'TALEND_ETL': 'TALEND',
        'INFORMATICA_POWERCENTER': 'INFORMATICA',
        'PENTAHO_DATA_INTEGRATION': 'PENTAHO',
        'MATILLION_ETL': 'MATILLION',
        'FIVETRAN_ELT': 'FIVETRAN',
        'STITCH_DATA': 'STITCH',
        'DBT_LABS': 'DBT',
        'DBT_CORE': 'DBT',
        'AIRBYTE_ETL': 'AIRBYTE',
        
        # Streaming & Real-time
        'APACHE_NIFI': 'NIFI',
        'APACHE_FLINK': 'FLINK',
        'CONFLUENT_KAFKA': 'KAFKA',
        'APACHE_PULSAR': 'PULSAR',
        'RABBITMQ_QUEUE': 'RABBITMQ',
        'APACHE_STORM': 'STORM',
        
        # Orchestration & Workflow
        'PREFECT_WORKFLOW': 'PREFECT',
        'DAGSTER_ORCHESTRATION': 'DAGSTER',
        'LUIGI_PIPELINE': 'LUIGI',
        'ARGO_WORKFLOW': 'ARGO',
        'APACHE_OOZIE': 'OOZIE',
        
        # Data Quality & Testing
        'GREAT_EXPECTATIONS': 'GREAT_EXP',
        'MONTE_CARLO': 'MONTE_CARLO',
        'SODA_DATA': 'SODA',
        'DEEQU_TESTING': 'DEEQU',
        
        # Data Governance & Catalog
        'APACHE_ATLAS': 'ATLAS',
        'COLLIBRA_DG': 'COLLIBRA',
        'ALATION_CATALOG': 'ALATION',
        'AMUNDSEN_CATALOG': 'AMUNDSEN',
        'DATAHUB_CATALOG': 'DATAHUB',
        
        # MLOps & Feature Stores
        'MLFLOW_TRACKING': 'MLFLOW',
        'FEAST_FEATURE_STORE': 'FEAST',
        'KUBEFLOW_MLOPS': 'KUBEFLOW',
        'WEIGHTS_AND_BIASES': 'WANDB',
        
        # Monitoring & Observability
        'DATADOG_MONITORING': 'DATADOG',
        'PROMETHEUS_METRICS': 'PROMETHEUS',
        'GRAFANA_LABS': 'GRAFANA',
        'NEW_RELIC': 'NEWRELIC',
        
        # Cloud Data Services
        'AWS_GLUE': 'GLUE',
        'AWS_EMR': 'EMR',
        'GCP_DATAFLOW': 'DATAFLOW',
        'GCP_DATAPROC': 'DATAPROC',
        'AZURE_DATA_LAKE': 'ADLS',
        'AZURE_STREAM_ANALYTICS': 'ASA',
        
        # SQL Query Engines
        'APACHE_PRESTO': 'PRESTO',
        'TRINO_SQL': 'TRINO',
        'APACHE_DRILL': 'DRILL',
        'APACHE_IMPALA': 'IMPALA',
        'CLICKHOUSE_DB': 'CLICKHOUSE',
        
        # NoSQL & Time Series
        'APACHE_CASSANDRA': 'CASSANDRA',
        'APACHE_HBASE': 'HBASE',
        'INFLUXDB_TIME': 'INFLUXDB',
        'TIMESCALE_DB': 'TIMESCALE',
        'REDIS_CACHE': 'REDIS',
        'APACHE_DRUID': 'DRUID',
        
        # Formats & Sérialisation
        'APACHE_ORC': 'ORC',
        'PROTOBUF_FORMAT': 'PROTOBUF',
        'THRIFT_FORMAT': 'THRIFT',
        'JSON_SCHEMA': 'JSON',
        'AVRO_SCHEMA_REGISTRY': 'AVRO',
        'MESSAGEPACK_FORMAT': 'MSGPACK',
        
        # CI/CD Data
        'GITLAB_DATA_CI': 'GITLAB',
        'JENKINS_PIPELINE': 'JENKINS',
        'CIRCLE_CI': 'CIRCLECI',
        'AZURE_DEVOPS': 'ADO',
        'SPINNAKER_CD': 'SPINNAKER',
        'TEAMCITY_BUILD': 'TEAMCITY',
        
        # Data Version Control
        'DVC_VERSIONING': 'DVC',
        'PACHYDERM_DATA': 'PACHYDERM',
        'LAKEFS_VERSION': 'LAKEFS',
        'GIT_LFS': 'GIT_LFS',
        'LIQUIBASE_DB': 'LIQUIBASE',
        
        # API & Integration
        'FASTAPI_REST': 'FASTAPI',
        'GRAPHQL_API': 'GRAPHQL',
        'GRPC_PROTOCOL': 'GRPC',
        'REST_API': 'REST',
        'SWAGGER_OPENAPI': 'SWAGGER',
        'KONG_GATEWAY': 'KONG',
        
        # Sécurité & Compliance
        'VAULT_SECRETS': 'VAULT',
        'RANGER_SECURITY': 'RANGER',
        'KERBEROS_AUTH': 'KERBEROS',
        'OKTA_IAM': 'OKTA',
        'KEYCLOAK_AUTH': 'KEYCLOAK',
        'OAUTH2_AUTH': 'OAUTH',
        'LDAP_AUTH': 'LDAP'
    }

    # Ajouter TECH_PATTERNS pour les cas flexibles
    TECH_PATTERNS = {
        # Cloud Providers
        'AZURE': ['MSAZURE', 'MS-AZURE', 'MS_CLOUD', 'MICROSOFT-CLOUD', 'AZURE-CLOUD', 'AZURE_CLOUD_PLATFORM', 'MICROSOFT_CLOUD_SERVICES'],
        'AWS': ['AMAZON-AWS', 'AMAZON-CLOUD', 'AMAZON_WEB', 'AMAZON-WEB-SERVICES', 'AWS_CLOUD_PLATFORM', 'AMAZON_CLOUD_SERVICES'],
        'GCP': ['GCLOUD', 'GOOGLE-CLOUD', 'GOOGLE_PLATFORM', 'GOOGLE-PLATFORM', 'GOOGLE_CLOUD_SERVICES', 'GCP_PLATFORM'],
        
        # Databases
        'POSTGRESQL': ['POSTGRES', 'PSQL', 'PG_SQL', 'PGSQL', 'POSTGRE'],
        'MONGODB': ['MONGO', 'MONGO_DB', 'MONGO-DATABASE'],
        'MYSQL': ['MARIA_DB', 'MARIADB', 'MY-SQL'],
        'MSSQL': ['SQL_SERVER', 'SQLSERVER', 'MS-SQL', 'MICROSOFT-SQL'],
        
        # Data Warehouses
        'BIGQUERY': ['BQ', 'BIG_QUERY', 'GOOGLE_BQ', 'GBQ', 'GOOGLE-BIGQUERY'],
        'SNOWFLAKE': ['SF', 'SNOW', 'SNOW_DB', 'SNOW-WAREHOUSE'],
        'REDSHIFT': ['RS', 'RED_SHIFT', 'AWS-REDSHIFT', 'AMAZON-REDSHIFT'],
        
        # BI Tools
        'POWER_BI': ['PBI', 'POWERBI', 'POWER-BI', 'MS-POWERBI', 'MICROSOFT-PBI'],
        'TABLEAU': ['TAB', 'TABLEAU-SOFTWARE', 'TABLEAU_DESKTOP'],
        'LOOKER': ['LOOKER_STUDIO', 'GOOGLE-LOOKER', 'DATA-STUDIO'],
        
        # Big Data
        'SPARK': ['APACHE-SPARK', 'PYSPARK', 'SPARK-SQL', 'SPARKML', 'SPARK_STREAMING', 'SPARK_STRUCTURED_STREAMING', 'DELTA_SPARK'],
        'HADOOP': ['APACHE-HADOOP', 'HDFS', 'HADOOP-ECOSYSTEM'],
        'DATABRICKS': ['DBX', 'DATA-BRICKS', 'DATABRICKS-PLATFORM'],
        
        # ETL/ELT
        'AIRFLOW': ['APACHE-AIRFLOW', 'AIR_FLOW', 'AIF', 'APACHE_AIRFLOW_SCHEDULER', 'AIRFLOW_DAG', 'AIRFLOW_OPERATOR'],
        'DBT': ['DBT_CORE', 'DBT-CLOUD', 'DBT_LABS'],
        'TALEND': ['TALEND-ETL', 'TALEND_STUDIO', 'TALEND-OPEN'],
        
        # Streaming
        'KAFKA': ['APACHE-KAFKA', 'KAFKA-STREAMS', 'CONFLUENT', 'KAFKA_CONNECT', 'KAFKA_STREAMS_APP', 'KAFKA_CONSUMER'],
        'KINESIS': ['AWS-KINESIS', 'KINESIS-STREAMS', 'AMAZON-KINESIS'],
        'PUBSUB': ['GOOGLE-PUBSUB', 'GCP-PUBSUB', 'PUB/SUB'],
        
        # DevOps
        'KUBERNETES': ['K8S', 'KUBE', 'K8', 'KUBE-CTL'],
        'DOCKER': ['DOCKER-CONTAINER', 'DOCKER-ENGINE', 'DOCKER-COMPOSE'],
        'TERRAFORM': ['TF', 'TERRA', 'TERRAFORM-IAS'],
        
        # Languages & Frameworks
        'PYTHON': ['PY', 'PYTHON3', 'PYTHON-PROGRAMMING'],
        'SCALA': ['SCALA-LANG', 'SCALA-PROGRAMMING'],
        'JAVA': ['JAVA-LANG', 'JAVA-SDK', 'JAVA-PROGRAMMING']
    }

    # Champs qui doivent être des entiers
    NUMERIC_FIELDS = {
        'DAILY_MIN', 'DAILY_MAX', 
        'EXPERIENCE_MIN', 'EXPERIENCE_MAX',
        'DURATION_DAYS'
    }

    def transform(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Transforme les données extraites en format standardisé."""
        try:
            logger.debug("🔄 Début de la transformation")
            
            transformed = {}
            for key, value in data.items():
                if key == 'URL':  # Ne pas transformer les URLs
                    transformed[key] = value
                elif key == 'TECHNOS':
                    transformed[key] = self._normalize_technos(value)
                elif key in self.NUMERIC_FIELDS:
                    transformed[key] = self._convert_to_int(value)
                else:
                    transformed[key] = self._normalize_text(value)
            
            logger.debug(f"✨ Données transformées : {json.dumps(transformed, indent=2, ensure_ascii=False)}")
            return transformed
            
        except Exception as e:
            logger.error(f"❌ Erreur lors de la transformation: {str(e)}")
            raise

    def _normalize_text(self, value: Any) -> Any:
        """Normalise le texte (majuscules, sans accents)."""
        if isinstance(value, str):
            # Convertir en majuscules et supprimer les accents
            normalized = unicodedata.normalize('NFKD', value.upper())
            normalized = ''.join(c for c in normalized if not unicodedata.combining(c))
            return normalized
        elif isinstance(value, list):
            return [self._normalize_text(item) for item in value]
        return value

    def _normalize_technos(self, technos: List[str]) -> List[str]:
        """Normalise la liste des technologies."""
        normalized = []
        for tech in technos:
            # Convertir en majuscules
            tech = tech.upper()
            
            # Vérifier si c'est un acronyme
            if tech in self.TECH_ACRONYMS:
                normalized.append(tech)
                continue
                
            # Appliquer le mapping de standardisation
            tech = tech.replace(' ', '_')
            tech = self.TECH_MAPPING.get(tech, tech)
            
            normalized.append(tech)
            
        return normalized 

    def _convert_to_int(self, value: Any) -> int:
        """Convertit une valeur en entier si possible."""
        if not value:  # Si vide ou None
            return 0
        try:
            return int(value)
        except (ValueError, TypeError):
            return 0 

    def _normalize_tech(self, tech: str) -> str:
        # 1. D'abord essayer le mapping exact
        if tech in self.TECH_MAPPING:
            return self.TECH_MAPPING[tech]
        
        # 2. Ensuite essayer les patterns
        for normalized, patterns in self.TECH_PATTERNS.items():
            if any(pattern in tech for pattern in patterns):
                return normalized
        
        # 3. Si rien ne correspond, retourner la techno telle quelle
        return tech 

    TECH_PATTERNS.update({
        # Enrichir Cloud Providers existants
        'AZURE': ['MSAZURE', 'MS-AZURE', 'MS_CLOUD', 'MICROSOFT-CLOUD', 'AZURE-CLOUD', 'AZURE_CLOUD_PLATFORM', 'MICROSOFT_CLOUD_SERVICES'],
        'AWS': ['AMAZON-AWS', 'AMAZON-CLOUD', 'AMAZON_WEB', 'AMAZON-WEB-SERVICES', 'AWS_CLOUD_PLATFORM', 'AMAZON_CLOUD_SERVICES'],
        'GCP': ['GCLOUD', 'GOOGLE-CLOUD', 'GOOGLE_PLATFORM', 'GOOGLE-PLATFORM', 'GOOGLE_CLOUD_SERVICES', 'GCP_PLATFORM'],

        # Enrichir Data Engineering existants
        'AIRFLOW': ['APACHE-AIRFLOW', 'AIR_FLOW', 'AIF', 'APACHE_AIRFLOW_SCHEDULER', 'AIRFLOW_DAG', 'AIRFLOW_OPERATOR'],
        'SPARK': ['APACHE-SPARK', 'PYSPARK', 'SPARK-SQL', 'SPARKML', 'SPARK_STREAMING', 'SPARK_STRUCTURED_STREAMING', 'DELTA_SPARK'],
        'KAFKA': ['APACHE-KAFKA', 'KAFKA-STREAMS', 'CONFLUENT', 'KAFKA_CONNECT', 'KAFKA_STREAMS_APP', 'KAFKA_CONSUMER'],
        
        # Data Quality
        'DEEQU': ['AWS_DEEQU', 'AMAZON_DEEQU', 'DEEQU_METRICS'],
        'GREAT_EXP': ['GE', 'GREAT_EX', 'GREAT_EXPECTATIONS_SUITE'],
        'SODA': ['SODA_CORE', 'SODA_CLOUD', 'SODA_SQL'],
        
        # Data Formats
        'PARQUET': ['APACHE_PARQUET', 'PARQ', 'PARQUET_FILE'],
        'AVRO': ['APACHE_AVRO', 'AVRO_SCHEMA', 'AVRO_FORMAT'],
        'DELTA': ['DELTA_LAKE', 'DELTA_FORMAT', 'DELTA_TABLE'],
        
        # Modern Data Stack
        'MAGE': ['MAGE_AI', 'MAGE_DATA', 'MAGE_PIPELINE'],
        'DAGSTER': ['DAGSTER_IO', 'DAGSTER_PIPELINE', 'DAGSTER_OP'],
        'PREFECT': ['PREFECT_FLOW', 'PREFECT_TASK', 'PREFECT_2'],
        'KEDRO': ['KEDRO_PIPELINE', 'KEDRO_FRAMEWORK', 'KEDRO_PROJECT'],
        
        # Data Discovery & Governance
        'DATAHUB': ['LINKEDIN_DATAHUB', 'META_DATAHUB', 'DATAHUB_METADATA'],
        'AMUNDSEN': ['LYFT_AMUNDSEN', 'AMUNDSEN_METADATA', 'AMUNDSEN_CATALOG'],
        'OPENMETADATA': ['OPEN_METADATA', 'OPENMETADATA_PLATFORM', 'OM_CATALOG'],
        
        # Modern Data Lake Formats
        'ICEBERG': ['APACHE_ICEBERG', 'ICEBERG_TABLE', 'ICEBERG_FORMAT'],
        'HUDI': ['APACHE_HUDI', 'HUDI_TABLE', 'HUDI_FORMAT'],
        
        # Observability & Monitoring
        'GRAFANA': ['GRAFANA_DASHBOARD', 'GRAFANA_LOKI', 'GRAFANA_TEMPO'],
        'PROMETHEUS': ['PROM', 'PROMETHEUS_METRICS', 'PROMETHEUS_ALERT'],
        'DATADOG': ['DD', 'DATADOG_AGENT', 'DATADOG_APM']
    })

    # Ajouter nouveaux mappings
    TECH_MAPPING.update({
        # Modern Data Engineering Tools
        'MAGE_AI_PIPELINE': 'MAGE',
        'KESTRA_WORKFLOW': 'KESTRA',
        'KEDRO_PIPELINE': 'KEDRO',
        'METAFLOW_NETFLIX': 'METAFLOW',
        'ZENML_PIPELINE': 'ZENML',
        
        # Data Quality & Testing
        'SODA_CORE': 'SODA',
        'ELEMENTARY_DATA': 'ELEMENTARY',
        'BIGEYE_PLATFORM': 'BIGEYE',
        'MONTE_CARLO_DATA': 'MONTE_CARLO',
        
        # Modern Data Governance
        'OPENMETADATA_PLATFORM': 'OPENMETADATA',
        'ATLAN_CATALOG': 'ATLAN',
        'METAPHOR_DISCOVERY': 'METAPHOR',
        'COLLIBRA_PLATFORM': 'COLLIBRA',
        
        # Modern Data Formats
        'DELTA_IO': 'DELTA',
        'APACHE_ARROW': 'ARROW',
        'APACHE_HUDI': 'HUDI',
        'APACHE_ICEBERG': 'ICEBERG',
        
        # Testing Frameworks
        'PYTEST_FRAMEWORK': 'PYTEST',
        'BEHAVE_BDD': 'BEHAVE',
        'CUCUMBER_TEST': 'CUCUMBER',
        'GREAT_EXPECTATIONS_SUITE': 'GREAT_EXP',
        
        # Data Build Tool (dbt) Ecosystem
        'DBT_CLOUD_PLATFORM': 'DBT',
        'DBT_CORE_ENGINE': 'DBT',
        'DBT_METRICS': 'DBT',
        'DBT_TESTS': 'DBT'
    }) 