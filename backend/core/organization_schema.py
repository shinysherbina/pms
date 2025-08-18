# core/graphql.py
import graphene
from graphene_django.types import DjangoObjectType
from core.models import Organization

class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = ("id", "name", "slug", "contact_email")

class OrganizationQuery(graphene.ObjectType):
    organizations = graphene.List(OrganizationType)

    def resolve_organizations(root, info):
        return Organization.objects.all()
