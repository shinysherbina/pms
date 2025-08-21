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

class CreateOrganization(graphene.Mutation):
	class Arguments:
		name = graphene.String(required=True)
		slug = graphene.String(required=True)
		contact_email = graphene.String(required=True)

	organization = graphene.Field(OrganizationType)

	def mutate(self, info, name, slug, contact_email):
		org = Organization.objects.create(
			name=name,
			slug=slug,
			contact_email=contact_email
		)
		return CreateOrganization(organization=org)

class UpdateOrganization(graphene.Mutation):
	class Arguments:
		id = graphene.Int(required=True)
		name = graphene.String()
		slug = graphene.String()
		contact_email = graphene.String()

	organization = graphene.Field(OrganizationType)

	def mutate(self, info, id, name=None, slug=None, contact_email=None):
		try:
			org = Organization.objects.get(pk=id)
		except Organization.DoesNotExist:
			raise Exception("Organization not found")

		if name is not None:
			org.name = name
		if slug is not None:
			org.slug = slug
		if contact_email is not None:
			org.contact_email = contact_email

		org.save()
		return UpdateOrganization(organization=org)
	
class OrganizationMutation(graphene.ObjectType):
	create_organization = CreateOrganization.Field()
	update_organization = UpdateOrganization.Field()