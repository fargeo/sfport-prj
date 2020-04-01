import os

#ADMINS = (
#)

ALLOWED_HOSTS = ['*']

#APP_ROOT = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))

#ADMIN_MEDIA_PREFIX = '/media/admin/'

#ANALYSIS_COORDINATE_SYSTEM_SRID = 3857

#ANONYMOUS_USER_NAME = None

#APP_NAME = 'Arches'

#APP_TITLE = 'Arches | Heritage Data Management'


#AUTHENTICATION_BACKENDS = (
#    django.contrib.auth.backends.ModelBackend,
#    guardian.backends.ObjectPermissionBackend,
#    arches.app.utils.permission_backend.PermissionBackend,
#)



#AUTH_PASSWORD_VALIDATORS = [
#    {
#        "NAME": "arches.app.utils.password_validation.NumericPasswordValidator"
#    },
#    {
#        "NAME": "arches.app.utils.password_validation.SpecialCharacterValidator",
#        "OPTIONS": {
#            "special_characters": [
#                "!",
#                "@",
#                "#",
#                ")",
#                "(",
#                "*",
#                "&",
#                "^",
#                "%",
#                "$"
#            ]
#        }
#    },
#    {
#        "NAME": "arches.app.utils.password_validation.HasNumericCharacterValidator"
#    },
#    {
#        "NAME": "arches.app.utils.password_validation.HasUpperAndLowerCaseValidator"
#    },
#    {
#        "NAME": "arches.app.utils.password_validation.MinLengthValidator",
#        "OPTIONS": {
#            "min_length": 9
#        }
#    }
#]



#CACHES = {
#    "default": {
#        "BACKEND": "django.core.cache.backends.memcached.MemcachedCache",
#        "LOCATION": "127.0.0.1:11211"
#    }
#}



#CACHE_BY_USER = {
#    "anonymous": 86400
#}


#COPYRIGHT_TEXT = 'All Rights Reserved.'

#COPYRIGHT_YEAR = '2016'


DATABASES = {
    "default": {
        "ATOMIC_REQUESTS": False,
        "AUTOCOMMIT": True,
        "CONN_MAX_AGE": 0,
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "HOST": "arches-hosted-postgres.csnyszsmskqt.us-west-1.rds.amazonaws.com",
        "NAME": "sfportprod",
         "OPTIONS": {},
        "PASSWORD": "G$7#y9Bwz4IP%jtPKP1t",
        "PORT": "5432",
        "POSTGIS_TEMPLATE": "template_postgis_20",
        "TEST": {
            "CHARSET": None,
            "COLLATION": None,
            "MIRROR": None,
            "NAME": None
        },
        "TIME_ZONE": None,
        "USER": "far2489"
    }
}



#DATATYPE_LOCATIONS = [
#    "arches.app.datatypes"
#]


#DATE_IMPORT_EXPORT_FORMAT = '%Y-%m-%d'

DEBUG = False

#ELASTICSEARCH_CONNECTION_OPTIONS = {
#    "timeout": 30
#}



ELASTICSEARCH_HOSTS = [
    {
#        "host": "vpc-arches-es65-production-aqxol75gfl6kjuauw4aekm6mma.us-west-1.es.amazonaws.com",
        "host": "vpc-arches-sfport-production-fski3wk2jd7uljjm76ayg4rs3y.us-west-1.es.amazonaws.com",
        "port": 80
    }
]

ELASTICSEARCH_HTTP_PORT = 80

USER_ELASTICSEARCH_PREFIX = 'sfportprod'

#EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

#EMAIL_HOST = 'localhost'

#EMAIL_HOST_PASSWORD = ''

#EMAIL_HOST_USER = ''

#EMAIL_PORT = 25

#EMAIL_USE_TLS = False


#INSTALLED_APPS = (
#    django.contrib.admin,
#    django.contrib.auth,
#    django.contrib.contenttypes,
#    django.contrib.sessions,
#    django.contrib.messages,
#    django.contrib.staticfiles,
#    django.contrib.gis,
#    arches,
#    arches.app.models,
#    arches.management,
#    guardian,
#    captcha,
#    revproxy,
#    corsheaders,
#)



#INTERNAL_IPS = (
#    127.0.0.1,
#)


#LANGUAGE_CODE = 'en-US'


#LOCALE_PATHS = (
#    /arches/locale,
#)



#LOGGING = {
#    "disable_existing_loggers": False,
#    "handlers": {
#        "file": {
#            "class": "logging.FileHandler",
#            "filename": "/arches/arches.log",
#            "level": "DEBUG"
#        }
#    },
#    "loggers": {
#        "arches": {
#            "handlers": [
#                "file"
#            ],
#            "level": "DEBUG",
#            "propagate": True
#        }
#    },
#    "version": 1
#}


#LOGIN_URL = 'auth'


#MANAGERS = (
#)

MEDIA_ROOT = os.path.join('/', 'home', 'ubuntu', 'sfport-prj', 'sfport_prj')

#MEDIA_URL = '/files/'


#MIDDLEWARE_CLASSES = [
#    "django.middleware.common.CommonMiddleware",
#    "django.middleware.csrf.CsrfViewMiddleware"
#]


#MODE = 'PROD'

#ONTOLOGY_BASE = 'cidoc_crm_v6.2.xml'

#ONTOLOGY_BASE_ID = 'e6e8db47-2ccf-11e6-927e-b8f6b115d7dd'

#ONTOLOGY_BASE_NAME = 'CIDOC CRM v6.2'

#ONTOLOGY_BASE_VERSION = '6.2'


#ONTOLOGY_EXT = [
#    "CRMsci_v1.2.3.rdfs.xml",
#    "CRMarchaeo_v1.4.rdfs.xml",
#    "CRMgeo_v1.2.rdfs.xml",
#    "CRMdig_v3.2.1.rdfs.xml",
#    "CRMinf_v0.7.rdfs.xml",
#    "arches_crm_enhancements.xml"
#]


#ONTOLOGY_PATH = '/arches/db/ontologies/cidoc_crm'

#OVERRIDE_RESOURCE_MODEL_LOCK = True

#POSTGIS_VERSION = (
#    2,
#    0,
#    0,
#)


#RESOURCE_IMPORT_LOG = 'arches/logs/resource_import.log'

#ROOT_DIR = '/arches'

#ROOT_URLCONF = 'arches.urls'

#SEARCH_BACKEND = 'arches.app.search.search.SearchEngine'


#STATICFILES_DIRS = (
#    /arches/app/media,
#)



#STATICFILES_FINDERS = (
#    django.contrib.staticfiles.finders.FileSystemFinder,
#    django.contrib.staticfiles.finders.AppDirectoriesFinder,
#)


#STATIC_ROOT = os.path.join(APP_ROOT, 'static')
STATIC_ROOT = '/home/ubuntu/sfport-prj/sfport-prj/static/'

STATIC_URL = "/static/"

#SYSTEM_SETTINGS_LOCAL_PATH = '/arches/db/system_settings/Arches_System_Settings_Local.json'


#TEMPLATES = [
#    {
#        "APP_DIRS": True,
#        "BACKEND": "django.template.backends.django.DjangoTemplates",
#        "DIRS": [
#            "/arches/app/templates"
#        ],
#        "OPTIONS": {
#            "context_processors": [
#                "django.contrib.auth.context_processors.auth",
#                "django.template.context_processors.debug",
#                "django.template.context_processors.i18n",
#                "django.template.context_processors.media",
#                "django.template.context_processors.static",
#                "django.template.context_processors.tz",
#                "django.template.context_processors.request",
#                "django.contrib.messages.context_processors.messages",
#                "arches.app.utils.context_processors.livereload",
#                "arches.app.utils.context_processors.map_info",
#                "arches.app.utils.context_processors.app_settings"
#            ],
#            "debug": True
#        }
#    }
#]



#TILE_CACHE_CONFIG = {
#    "name": "Disk",
#    "path": "/arches/tileserver/cache"
#}


#TIME_ZONE = 'America/Chicago'

#USE_I18N = True

#USE_L10N = True

#USE_TZ = False

#WSGI_APPLICATION = 'arches.wsgi.application'
