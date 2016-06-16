# FENIX Catalog

```javascript

var Catalog = require('fx-catalog/start');

var catalog = new Catalog(options);
```

# Configuration

To have a look of the default configuration check `fx-catalog/config/config.js`.

<table>
   <thead>
      <tr>
         <th>Parameter</th>
         <th>Type</th>
         <th>Default Value</th>
         <th>Example</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>el</td>
         <td>CSS3 Selector/JavaScript DOM element/jQuery DOM element</td>
         <td> - </td>
         <td>"#container"</td>
         <td>component container</td>
      </tr>
      <tr>
         <td>cache</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>whether or not to use FENIX bridge cache</td>
      </tr>
      <tr>
         <td>perPage</td>
         <td>string</td>
         <td>10</td>
         <td>20</td>
         <td>How many results to show per page</td>
      </tr>
      <tr>
         <td>actions</td>
         <td>Array of string</td>
         <td>['select']</td>
         <td>['select', 'metadata', 'view', 'download']</td>
         <td>The action button aside of each result</td>
      </tr>
      <tr>
         <td>excludedAction</td>
         <td>object</td>
         <td>{
            dataset : [],
            geographic : ['download']
            }
         </td>
         <td>{
            dataset : ['download'],
            geographic : []
            }
         </td>
         <td>Keyset is the enumeration of FENIX resource representation type. Value: array of string with the resultActions to exclude for a specific resource representation type.</td>
      </tr>
      <tr>
         <td>menuExcludedItems</td>
         <td>Array of string</td>
         <td>[]</td>
         <td>['accessibility']</td>
         <td>Ids of menu items to hide fro default configuration</td>
      </tr>
      <tr>
         <td>searchTimeoutInterval</td>
         <td>number</td>
         <td>1000</td>
         <td>2000</td>
         <td>Result refresh timeout for instant search</td>
      </tr>
      <tr>
         <td>dateFormat</td>
         <td>string</td>
         <td>'YYYY MMM DD'</td>
         <td>'YYYY M DD'</td>
         <td>Moment JS date format</td>
      </tr>
      <tr>
         <td>hideCloseButton</td>
         <td>boolean</td>
         <td>false</td>
         <td>true</td>
         <td>Hide the close button</td>
      </tr>
      <tr>
         <td>columns</td>
         <td>object</td>
         <td> title: {
            path : "title",
            type: "i18n"
            },
            source : {
            path : "contacts",
            type : "source"
            },
            last_update : {
            path : "meMaintenance.seUpdate.updateDate",
            type : "epoch"
            },
            region : {
            path: "meContent.seCoverage.coverageGeographic",
            type: "code"
            },
            resourceType : {
            path: "meContent.resourceRepresentationType"
            }
         </td>
         <td>-</td>
         <td>Keyset: columns is, value: object. path: FENIX metadata v2.0 path of the metadata attribute to show. Type: attribute type</td>
      </tr>
      <tr>
         <td>d3pFindParams</td>
         <td>object</td>
         <td>{
            full: true,
            order : "meMaintenance.seUpdate.updateDate:desc" //order by last update
            }
         </td>
         <td>-</td>
         <td>D3P compatible string parameters</td>
      </tr>
      <tr>
         <td>defaultSelectors</td>
         <td>Array of selector id</td>
         <td>['resourceType', 'contextSystem']
         </td>
         <td>['resourceType']</td>
         <td>Id of the default selectors of the catalog. Id are accessible from the selectors registry.</td>
      </tr>
      <tr>
         <td>environment</td>
         <td>string</td>
         <td>'develop'
         </td>
         <td>'production'</td>
         <td>Server environment</td>
      </tr>
      <tr>
         <td>lang</td>
         <td>string</td>
         <td>'EN'</td>
         <td>'FR'</td>
         <td>Multilingual</td>
      </tr>
      <tr>
         <td>selectorsRegistry</td>
         <td>Object</td>
         <td>check `fx-catalog/config/selectorsRegistry.js`</td>
         <td>-</td>
         <td>Expandable available selectors registry</td>
      </tr>
   </tbody>
</table>
# API

```javascript
//This is an example
catalog.reset();
```

- `catalog.reset()` : reset catalog filter criteria and results
- `catalog.on(event, callback[, context])` : pub/sub 
- `catalog.dispose()` : dispose the catalog instance

# Events

- `select` : triggered when a "select" button is clicked
- `download` : triggered when a "download" button is clicked
- `view` : triggered when a "view" button is clicked
- `metadata` : triggered when a "metadata" button is clicked

# Filtering process

Results will be referred to the baseFilter criteria merged with the user selection. In case a user selects a criteria already 
defined in the base filter, the user choice will override the baseFilter one.

# Selectors registry

It is possible to add custom selectors. In order to do so, use the `selectorsRegistry` option that will be merged to the defaults one.
In case an added selector has the same `id` of a default one, the default one will be overridden.