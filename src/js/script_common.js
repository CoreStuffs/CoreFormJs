Vue.use(window.vuelidate.default);
var registeredFields = new Map();


var formValidators = {
    "required": {
        build: function (data) {
            return window.validators.required;
        }
    },
    "minLength": {
        build: function (data) {
            return window.validators.minLength(data.minLength);
        }
    },
    "maxLength": {
        build: function (data) {
            return window.validators.maxLength(data.maxLength);
        }
    },
    "number": {
        build: function (data) {
            return window.validators.number;
        }
    },
    "email": {
        build: function (data) {
            return window.validators.email;
        }
    }
}

function RegisterField(fieldDefinition) {

   if (typeof (fieldDefinition.isDataField) === "undefined") fieldDefinition.isDataField = true;

    if (!fieldDefinition.fieldTemplate.computed) fieldDefinition.fieldTemplate.computed = {};
    if (!fieldDefinition.editForm.computed) fieldDefinition.editForm.computed = {};
    if (!fieldDefinition.fieldTemplate.methods) fieldDefinition.fieldTemplate.methods = {};


    fieldDefinition.fieldTemplate.computed.$validation = function () {
        return this.schema.variable ? (this.$root.$form.$v.data[this.schema.variable] ? this.$root.$form.$v.data[this.schema.variable] : null) : null;
    }

    fieldDefinition.fieldTemplate.computed.$isrequired = function () {
        if (this.$validation) {
            for (const param in this.$validation.$params) {
                if (this.$validation.$params[param].type === "required") return true;
            }
        }
    }



    fieldDefinition.fieldTemplate.computed.$error = function () {
        return (this.$validation ? this.$validation.$error : false);
    }

    fieldDefinition.fieldTemplate.computed.$errorMessage = function () {
        if (this.$validation && this.$validation.$error && this.schema.variable) {
            for (const valid in this.$validation) {
                if (!String(this.$validation[valid]).startsWith("$") && this.$validation[valid] === false) {
                    for (const varid in this.$root.$form.schema.variables) {
                        var variable = this.$root.$form.schema.variables[varid];
                        if (variable.name === this.schema.variable) {
                            for (const vali in variable.validations) {
                                var validation = variable.validations[vali];
                                if (validation.type === this.$validation.$params[valid].type) {
                                    return validation.errorMessage;
                                }
                            }
                        }
                    }

                }
            }
        }
        return "";
    }

    fieldDefinition.fieldTemplate.methods.$touch = function () {
        (this.$validation ? this.$validation.$touch() : false);
    };

    fieldDefinition.editForm.computed.$validation = function () {
        return this.$parent.$v.field;
    }

    Vue.component(fieldDefinition.type, fieldDefinition.fieldTemplate);
    Vue.component('edit_' + fieldDefinition.type, fieldDefinition.editForm);

    registeredFields.set(fieldDefinition.type, fieldDefinition);
}



function extend(source, update) {
    var to = _extend(source);
    Object.assign(to, update);
    return to;
}

function _extend(from, to) {
    if (from == null || typeof from != "object") return from;
    if (from.constructor != Object && from.constructor != Array) return from;
    if (from.constructor == Date || from.constructor == RegExp || from.constructor == Function ||
        from.constructor == String || from.constructor == Number || from.constructor == Boolean)
        return new from.constructor(from);

    to = to || new from.constructor();

    for (var name in from) {
        to[name] = typeof to[name] == "undefined" ? _extend(from[name], null) : to[name];
    }

    return to;
}


var __createVue = function(elementPath, opts){
    return {
        el: elementPath,
        data: function () {
            return {
                data: {},
                schema: {
                    'schemaVersion': 1,
                    'formVersion': 0,
                    'name': 'FirstSchema',
                    'title': 'My first schema',
                    fields: [],
                    variables: []
                },
                datasources:[]
            }
        },
        computed: {
            $form: function () {
                return this.$refs.___formapp___;
            },
            variableTypes:function(){
                return {
                    'text':{
                        text:'String or Text',
                        optionalValidations:['required', 'minLength', 'maxLength', 'email']
                    },
                    'number':{
                        text:'Numeric value',
                        implicitValidations:['number'],
                        optionalValidations:['required']
                    },
                    'richtext':{
                        text:'Rich content',
                        optionalValidations:['required']
                    },
                    'datetime':{
                        text:'Date and time',
                        optionalValidations:['required']
                    },
                    'datetimerange':{
                        text:'Date and time range',
                        optionalValidations:['required']
                    },
                    'listitemarray':{
                        text:'Multiple selection items',
                        optionalValidations:['required']
                    },
                    'listitem':{
                        text:'Selection item',
                        optionalValidations:['required']
                    }
                };
            }
        },
        methods: {
            variableTypeText:function(name){
                return this.variableTypes[name].text;
            },
            getExternalDataItem : function (sourceid, itemid, onSuccess, query) {
                if(opts.dataAdapter && opts.dataAdapter.getDataItem) opts.dataAdapter.getDataItem(id, onSuccess, query);
            },
            getExternalData : function (id, onSuccess, query) {
                if(opts.dataAdapter && opts.dataAdapter.getData) opts.dataAdapter.getData(id, onSuccess, query);
            },
            getExternalDataSources : function (onSuccess) {
                if(opts.dataAdapter && opts.dataAdapter.getDataSources) opts.dataAdapter.getDataSources(onSuccess);
            },
            getExternalDataSource: function(id){
                for (let index = 0; index < this.datasources.length; index++) {
                    const element = this.datasources[index];
                    if(element.id.toLowerCase()===id.toLowerCase()) return element;
                }
            }

        },
        mounted:function(){
            var t = this;
            this.getExternalDataSources(function(data){
                t.datasources = data;
            });
        }
    };
}


var coreform = {
    formBuilder: function (elementPath, opts, schema) {
        $(elementPath).empty();
        $(elementPath).append($("<v-formbuilder id='___formapp___' ref='___formapp___'/>"));
        var vue = __createVue(elementPath, opts);
        vue.methods.saveFormSchema=function(schema, callback){
            opts.onSavingSchema(schema, callback);
        }        
        var v = new Vue(vue);
        if(schema)v.schema = schema;
        return{
            setSchema:function(schema){
                v.schema = schema; 
                return this;             
            },
            getSchema:function(){
                return v.schema;              
            }
        }
    },
    formRenderer: function (elementPath, opts, schema, data) {
        $(elementPath).empty();
        $(elementPath).append($("<v-formrenderer id='___formapp___' ref='___formapp___'/>"));
        var vue = __createVue(elementPath, opts);
        vue.methods.saveFormData=function(data, callback){
            opts.onSavingData(data, callback);
        }

        var v= new Vue(vue);
        if(schema)v.schema = schema;
        if(data) v.data = data;
        return{
            setSchema:function(schema){
                v.schema = schema; 
                return this;             
            },
            setData:function(data){
                v.data = data;  
                return this;            
            },
            getData:function(){
                return v.data;              
            }
        }


    }
}




