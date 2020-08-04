from connexion.resolver import Resolver
import re

def camel_case_replace(matchobj):
    return '_{}'.format(matchobj.group(0).lower())

class CamelCaseResolver(Resolver):
    def __init__(self, module_name):
        Resolver.__init__(self)
        self.module_name = module_name


    def resolve_operation_id(self, operation):
        camel_case_operation_id = operation.operation_id
        operation_id = re.sub(r'[A-Z]', camel_case_replace, camel_case_operation_id)
        
        return '{}.{}'.format(self.module_name, operation_id)