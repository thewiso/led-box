from connexion.decorators.validation import RequestBodyValidator
from connexion.json_schema import Draft4RequestValidator
import jsonschema
from jsonschema.exceptions import ValidationError


def validate_discriminator(validator, discriminator, instance, schema):
    if not validator.is_type(instance, "object"):
        return

    discriminator_prop_name = discriminator.get("propertyName")
    discriminator_prop = instance.get(discriminator_prop_name)
    if discriminator_prop is not None:
        components = schema.get("components")
        # if the following is not true, we are in the validation of an subtype which was triggered by this function
        if components is not None:
            schemas = components.get("schemas")
            sub_type_schema = schemas.get(discriminator_prop)
            if sub_type_schema is not None:
                sub_type_allof = sub_type_schema.get("allOf")
                if sub_type_allof is not None:
                    super_type_schema = sub_type_allof[0]
                    # if {key: value for key, value in schema.items() if key != "components"} == {key: value for key, value in super_type_schema.items()}:
                    if all(entry in schema.items() for entry in super_type_schema.items()):
                        for error in validator.descend(instance, sub_type_schema):
                            yield error
                    else:
                        yield ValidationError(f"Discrimantor type {discriminator_prop} does not inherit from the super type")
                # elif {key: value for key, value in schema.items() if key != ("components", "x-scope")} == {key: value for key, value in sub_type_schema.items()}:
                elif not all(entry in schema.items() for entry in sub_type_schema.items()):
                    yield ValidationError(f"Discrimantor type {discriminator_prop} does not inherit from the super type")
                # else this discriminator points to the super type itself
            else:
                yield ValidationError(f"No component schema found for discrimantor value {discriminator_prop}")
    else:
        yield ValidationError(f"{discriminator_prop_name} is the required discriminator property")


DiscriminatorDraft4RequestValidator = jsonschema.validators.extend(
    Draft4RequestValidator, {'discriminator': validate_discriminator})


class DiscriminatorRequestBodyValidator(RequestBodyValidator):
    def __init__(self, *args, **kwargs):
        super(DiscriminatorRequestBodyValidator, self).__init__(
            *args, validator=DiscriminatorDraft4RequestValidator, **kwargs)
