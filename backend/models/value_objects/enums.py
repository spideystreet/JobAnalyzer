from enum import Enum

class JobDomain(str, Enum):
    DATA = "DATA"
    FULLSTACK = "FULLSTACK"
    WEB3 = "WEB3"
    AI = "AI"
    MOBILE = "MOBILE"

class JobStatus(str, Enum):
    NEW = "NEW"
    ANALYZED = "ANALYZED"
    ARCHIVED = "ARCHIVED"

class RemoteType(str, Enum):
    FULL = "100%"
    PARTIAL = "PARTIEL"

class CompanyType(str, Enum):
    AGENCE_COM_RH = "Agence de COM / RH"
    AGENCE_WEB = "Agence WEB / Communication"
    CABINET_CONSEIL = "Cabinet de conseil"
    CABINET_RECRUTEMENT = "Cabinet de recrutement / placement"
    CENTRE_FORMATION = "Centre de formation"
    COMMERCIAL = "Commercial indépendant"
    DSI = "DSI / Client final"
    ECOLE = "Ecole IT / Université"
    EDITEUR = "Editeur de logiciels"
    ESN = "ESN"
    PORTAGE = "Société de portage"
    SOURCING = "Sourcing / chasseur de têtes"
    STARTUP = "Start-up" 