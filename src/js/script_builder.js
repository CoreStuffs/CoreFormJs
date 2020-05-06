


Vue.component('v-formbuilder', {
    template: `<div class="cs-cf" v-cloak>
                    <div class="uk-card uk-card-default uk-card-body">
                            <fieldset class="uk-fieldset">
                                <h3 class="uk-card-title">{{schema.title}}</h3>
                                <small>version {{schema.formVersion}}</small>

                                <ul uk-tab>
                                    <li><a href="#">Identification</a></li>
                                    <li><a href="#">Data model</a></li>
                                    <li><a href="#">Form designer</a></li>
                                    <li><a href="#">Debug</a></li>
                                </ul>
                                <ul class="uk-switcher uk-margin-bottom">
                                    <li>
                                        <form id="formContainer" data-ref="root" class=" uk-form-stacked">
                                            <div class="uk-margin">
                                                <label class="uk-form-label" for="formName">Name:</label>
                                                <div class="uk-form-controls">
                                                    <input id="formName" class="uk-input uk-form-small" v-model="schema.name" />
                                                </div>
                                            </div>
                                            <div class="uk-margin">
                                                <label class="uk-form-label" for="formTitle">Title:</label>
                                                <div class="uk-form-controls">
                                                    <input id="formTitle" class="uk-input uk-form-small" v-model="schema.title" />
                                                </div>
                                            </div>
                                        </form>
                                    </li>
                                    <li>
                                        <cf_variableTable :variables="schema.variables"/>
                                    </li>
                                    <li>    
                                        <div class="uk-grid-collapse" uk-grid>
                                            <div class="uk-width-expand@s">
                                                <div id="formContainer" data-ref="root" class=" nested-sortable uk-form-stacked" style="padding:10px;min-height:60px">
                                                    <component v-for="field in schema.fields"
                                                                :key="field.id"
                                                                :is="field.type"
                                                                :schema="field"
                                                                v-bind="field"
                                                                v-model="data[field.variable]">
                                                    </component>
                                                </div>
                                            </div>
                                            <div class="uk-width-1-5@s">
                                                <div class="uk-sticky uk-active uk-sticky-bottom uk-sticky-fixed"  uk-sticky="bottom: 100000">
                                                    <div id="mnuComponents">
                                                            <div class="draggable" data-type="textField"">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>
                                                                Text input
                                                            </div>
                                                            <div class="draggable" data-type="passwordField">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                        
                                                                Password input
                                                            </div>
                                                            <div class="draggable" data-type="checkboxField">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                                                                                
                                                                Decision
                                                            </div>
                                                            <div class="draggable" data-type="richtextField">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                        
                                                                Richtext Field
                                                            </div>
                                                            <div class="draggable" data-type="datetimeField">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                                                                                
                                                                Date & Time Field
                                                            </div>
                                                            <div class="draggable" data-type="selectField">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                                                                                
                                                                List selector
                                                            </div>
                                                            <div class="draggable" data-type="grid">
                                                                <span uk-icon="tag" class="uk-margin-small-right"></span>                                                                                                                
                                                                Columns
                                                            </div>
                                                    </div>
                                                    <a @click="saveSchema()" style="font-size:12px">
                                                        <span uk-icon="icon: check" class="uk-margin-small-right uk-text-left"></span>
                                                        <span class="uk-text-middle">Test validators</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                    </li>
                                    <li>
                                        <ul uk-accordion="multiple: true">
                                            <li class="uk-open">
                                                <a class="uk-accordion-title" href="#">Schema</a>
                                                <div class="uk-accordion-content"><pre><code style="font-size:12px">{{ schema }}</code></pre></div>
                                            </li>
                                            <li>
                                                <a class="uk-accordion-title" href="#">Data</a>
                                                <div class="uk-accordion-content"><pre><code style="font-size:12px">{{ data }}</code></pre></div>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                

                                <button class="uk-button uk-button-primary uk-button-small" @click="saveSchema()">
                                    <span uk-icon="icon: upload" class="uk-margin-small-right uk-text-left"></span>
                                    <span class="uk-text-middle">Save</span>
                                </button>
                            </fieldset>

                          
                    </div>
                    <cf_editfieldmodal ref="editFormModal" />
                    <cf_editvariablemodal ref="editVariableModal" />
                </div>`,
    data: function () {
        return this.$parent;
    },
    validations: function () {
        var obj = { data: {} };

        for (const varid in this.schema.variables) {
            var variable = this.schema.variables[varid];
            obj.data[variable.name] = {};
            var rv = obj.data[variable.name];
            var i = 0;
            for (const valid in variable.validations) {
                var v = variable.validations[valid];
                rv["v" + i] = formValidators[v.type].build(v);
                i++;
            }

        };
        return obj;
    },
    methods: {
        saveSchema: function () {
            this.$root.saveFormSchema(this.schema, function (data) {
                UIkit.modal.alert("Successfully saved");
            });
        },
        openSettingsByObject: function (obj, callback) {
            Object.assign(obj, registeredFields.get(obj.type).sanitizeSchemaModel(obj, obj.id));
            this.$refs.editFormModal.show(obj, function (model) {
                Object.assign(obj, model);
                if (callback) callback(obj);
            });

        },
        openSettingsById: function (id) {
            var obj = this.findNodeById(id, this.schema);
            this.openSettingsByObject(obj);

        },
        openVariableSettings: function (variable, callback) {
            var vari;
            if(variable){
                vari = variable;
            }else{
                vari = {
                    name : '',
                    validations:[{type:'required'}]
                };
            }

            this.$refs.editVariableModal.show(vari, function (model) {
                Object.assign(vari, model);
                if (callback) callback(vari);
            });

        },

        removeNodeById: function (id) {
            var schema = this.schema;
            var app = this;
            UIkit.modal.confirm('Are you sure to want to delete this field?').then(function () {
                var obj = app.findNodeById(id, schema);
                var coll = app.findParentNodeCollectionById(schema, id);
                const index = coll.indexOf(obj);
                if (index > -1) {
                    coll.splice(index, 1);
                }

            }, function () {

            });
        },
        applyToolbarEvents: function () {
            $(".sortable-item").mousemove(function (event) {
                event.stopPropagation();
                $(".toolbar").hide();
                $(this).find("> .toolbar").show();
            });
            $(".sortable-item").mouseleave(function () {
                event.stopPropagation();
                $(this).find("> .toolbar").hide();
            });
        },
        configureNestedTables: function () {
            var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));
            var _parent = this;
            // Loop through each nested sortable element
            for (var i = 0; i < nestedSortables.length; i++) {
                new Sortable(nestedSortables[i], {
                    group: {
                        name: 'share',
                    },
                    draggale: '.sortable-item',
                    handle: '.moveHandle',
                    animation: 150,
                    fallbackOnBody: true,
                    swapThreshold: 0.25,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-dragitem',
                    onAdd: function (evt) {
                        var elName;
                        if (evt.pullMode === "clone") {
                            var item = $(evt.item);
                            var type = item.data("type");
                            var newId = 'ctrl_' + _parent.getNextId(_parent.schema);
                            var model = registeredFields.get(type).sanitizeSchemaModel(null, newId);
                            model.id = newId
                            model.type = type

                            var newIndex = evt.newDraggableIndex;
                            var collTo = _parent.findNodeCollectionByDomElement($(evt.to), _parent.schema);
                            item.remove();

                            _parent.openSettingsByObject(model, function (model) {
                                collTo.splice(newIndex, 0, model);
                                _parent.$nextTick(function () { _parent.configureNestedTables(); });

                            });
                        }
                    },
                    onEnd: function (/**Event*/evt) {
                        var itemEl = evt.item;  // dragged HTMLElement
                        evt.to;    // target list
                        evt.from;  // previous list
                        evt.oldIndex;  // element's old index within old parent
                        evt.newIndex;  // element's new index within new parent
                        evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
                        evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
                        evt.clone // the clone element
                        evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

                        var item = _parent.findNodeById($(evt.clone).data("ref"), this);
                        var collFrom = _parent.findNodeCollectionByDomElement($(evt.from), this);
                        var collTo = _parent.findNodeCollectionByDomElement($(evt.to), this);

                        if (item && collFrom && collTo) {
                            var newIndex = evt.newDraggableIndex;
                            var oldIndex = evt.oldDraggableIndex;
                            if (collFrom === collTo) {
                                if (newIndex > oldIndex) {
                                    newIndex++;
                                } else {
                                    oldIndex++;
                                }
                            }
                            collTo.splice(newIndex, 0, item);
                            collFrom.splice(oldIndex, 1);
                        }
                        _parent.configureNestedTables();
                    }
                });

            }
        },
        getNextId: function () {
            var schema = this.schema;
            var highestId = 0;
            var _s = function (node, func) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                func(node);
                if (subColl !== null) {
                    for (var i = 0; i < subColl.length; i++) {
                        _s(subColl[i], func);
                    }
                }
            }
            _s(schema, function (node) {
                if (typeof (node.id) !== 'undefined') {
                    var sId = node.id;
                    if (sId.startsWith("ctrl_")) {
                        iId = parseInt(sId.substring(5));
                        if (iId > highestId) highestId = iId;
                    }
                }
            });
            return highestId + 1;
        },
        applyNodeModification: function (modification) {
            var schema = this.schema;
            var __s = function (node, modification) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                modification(node);
                if (subColl !== null) {
                    for (var i = 0; i < subColl.length; i++) {
                        var res = __s(subColl[i], modification);
                        if (res !== null) return res;
                    }
                }
                return null;
            }
            __s(schema, modification);
        },
        findNodeById: function (id) {
            var schema = this.schema;
            if (id === "formContainer") return schema;
            var __s = function (node, id) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                if (id === node.id) {
                    return node;
                } else {
                    if (subColl !== null) {
                        for (var i = 0; i < subColl.length; i++) {
                            var res = __s(subColl[i], id);
                            if (res !== null) return res;
                        }
                    }
                }
                return null;
            }
            return __s(schema, id)
        },
        sanitizeSchemaModel: function (schema) {
            var __s = function (node) {
                if (!node) return node;
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                if (node.type) Object.assign(node, registeredFields.get(node.type).sanitizeSchemaModel(node, node.id));
                if (subColl !== null) {
                    for (var i = 0; i < subColl.length; i++) {
                        var res = __s(subColl[i]);
                    }
                }
            }
            __s(schema)
            return schema;
        },
        findNodeCollectionByDomElement: function (element) {
            var schema = this.schema;
            var id = null;
            if ($(element).attr("id")) id = $(element).attr("id");
            else if ($(element).data("ref")) id = $(element).data("ref");

            if (id === "formContainer") return schema.fields;
            var __s = function (node, id) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                if (subColl === null) return null;
                if (id === node.id) {
                    return subColl;
                } else {
                    for (var i = 0; i < subColl.length; i++) {
                        var res = __s(subColl[i], id);
                        if (res !== null) return res;
                    }
                }
                return null;
            }

            return __s(schema, id)
        },
        findParentNodeCollectionById: function (node, id) {
            var subColl = null;
            if (typeof (node.columns) !== "undefined") subColl = node.columns;
            if (typeof (node.fields) !== "undefined") subColl = node.fields;

            if (subColl === null) return null;

            for (var i = 0; i < subColl.length; i++) {

                if (subColl[i].id && subColl[i].id === id) {
                    return subColl;
                }

                var res = this.findParentNodeCollectionById(subColl[i], id);
                if (res !== null) return res;
            }

            return null;
        }


    },
    created: function () {
        // `this` est une reference a l'instance de vm
        for (let [key, value] of registeredFields.entries()) {
            this.$options.components[key] = value.fieldTemplate;
        }
        for (let [key, value] of Object.entries(this.$options.components)) {
            value.components = this.$options.components;
        }

        var urlParams = new URLSearchParams(window.location.search);
        var schemaId = urlParams.get('schemaid');
        var root = this;
        if (schemaId !== null && typeof (schemaId) !== 'undefined' && schemaId !== "") {
            $.ajax({
                url: "/Form/" + schemaId + "/schema",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    root.schema = root.sanitizeSchemaModel(data);
                }
            });
        }


    },
    updated: function () {
        this.$nextTick(function () {
            // Update events to ensure that toolbar will appear for newly added items
            this.applyToolbarEvents();
            this.sanitizeSchemaModel();
        })
    },
    mounted: function () {
        this.$nextTick(function () {
            // Update events to ensure that toolbar will appear for newly added items
            this.applyToolbarEvents();
           
            var toolbar = document.getElementById('mnuComponents');
            new Sortable(toolbar, {
                group: {
                    name: 'share',
                    pull: 'clone', // To clone: set pull to 'clone'
                    put: false
                },
                draggale: '.draggable',
                animation: 0,
                fallbackOnBody: true,
                sort: false,
                dragClass: 'yellow-background-class',
            });

            this.configureNestedTables();


        })
    }
});








