import streamlit as st

st.title("Hello ! 👋")
st.write("Cette app a été gentillement développée par [@moi](https://www.linkedin.com/in/hicham-djebali-35bb271a2/)")

from supabase import create_client, Client
import streamlit as st
import pandas as pd
import plotly.express as px


# Infos Supabase (remplace par tes valeurs)
SUPABASE_URL="https://sspzxnulivsmpnalhatw.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzcHp4bnVsaXZzbXBuYWxoYXR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM3NDA3NywiZXhwIjoyMDUxOTUwMDc3fQ.GQiuNioTqL20S23wyheK2Lo9Vj7WOyTEqW-2wNYU0II"
DATABASE_URL="postgresql://postgres:ohwahpHDLv8twC@uJr9VmRi&@db.sspzxnulivsmpnalhatw.supabase.co:5432/postgres"

# Connexion
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Récupérer toutes les lignes d'une table "users"
response = supabase.table("job_offers").select("*").execute()

# Afficher les résultats dans Streamlit
if response.data:
    st.write(response.data)
else:
    st.error("Aucune donnée trouvée")

# Vérifier si on a des données
if response.data:
    df = pd.DataFrame(response.data)

    # Compter les occurrences des domaines
    domain_counts = df["DOMAIN"].value_counts().reset_index()
    domain_counts.columns = ["DOMAIN", "COUNT"]

    # Ajouter la proportion par rapport au total
    total_offers = domain_counts["COUNT"].sum()
    domain_counts["PERCENTAGE"] = (domain_counts["COUNT"] / total_offers) * 100

    # Afficher le DataFrame
    st.write(domain_counts)

    # Créer un graphique en camembert avec Plotly
    fig = px.pie(domain_counts, values="PERCENTAGE", names="DOMAIN", title="Répartition des domaines des offres")
    st.plotly_chart(fig)
else:
    st.error("Aucune donnée trouvée dans la table 'job_offers'.")
