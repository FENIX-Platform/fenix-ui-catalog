FENIX - Ui Catalog
================

Component to browse FENIX resources

#Override catalog configuration

It is possible to override the following configurations:

* services url (e.g D3S search URL)
* lateral collapsible menu
* the filter form and its selectors
* the mapping between selectors and metadata attributes
* the initial blank filter to perform the search

In order to override the configuration, define the following RequireJS paths in the Host Controller

##services url
Used in file : Used in file : fenix-ui-catalog/js/catalog/widgets/bridge/Fx-catalog-bridge-filter.js
RequireJS path :  'fx-cat-br/config/fx-catalog-collapsible-menu-config.json'

Use to define the items to display in the later menu.
##Lateral collapsible menu
Used in file : fenix-ui-catalog/js/catalog/widgets/filter/Fx-catalog-collapsible-menu.js
RequireJS path :  'fx-cat-br/config/fx-catalog-collapsible-menu-config'

Use to define the items to display in the later menu.

##the filter form and its selectors
Used in file : fenix-ui-catalog/js/catalog/widgets/filter/Fx-catalog-modular-form.js
RequireJS path :  'fx-cat-br/config/fx-catalog-modular-form-config'

Use to define the set of selector (and theirs render functions) to display in the filter form.

##the mapping between selectors and metadata attributes
Used in file : fenix-ui-catalog/js/catalog/widgets/bridge/plugins/Fx-catalog-bridge-filter-plugin.js
RequireJS path :  'fx-cat-br/config/fx-catalog-filter-mapping'

Define the mapping between selectors and metadata attributes.

##the initial blank filter to perform the search
Used in file : fenix-ui-catalog/js/catalog/widgets/bridge/plugins/Fx-catalog-bridge-filter-plugin.js
RequireJS path :  'fx-cat-br/config/fx-catalog-blank-filter'

Define if the search filter has pre populated filter attributes.