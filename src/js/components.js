RegisterField({
    type: 'grid',
    display: 'Columns',
    isDataField: false,
    sanitizeSchemaModel: function (model, id) {
        if (!model) model = {};
        if ((typeof (model.showSeparator) === 'undefined')) model.showSeparator = false;
        if (!model.columns) model.columns = [];
        if (model.columns.length === 0) {
            model.columns.push({ 'id': 'col_' + id + '_1', 'width': '1-2', 'fields': [] });
            model.columns.push({ 'id': 'col_' + id + '_2', 'width': '1-2', 'fields': [] });
        }
        return model;
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><div class="row uk-grid" v-bind:class="{'uk-grid-divider uk-grid-collapse': schema.showSeparator, 'uk-grid-medium': !schema.showSeparator}" uk-grid>
			    <div :class="'nested-sortable uk-width-'+ column.width + '@m'" style="min-height:60px" :id="column.id" :data-column="index" :data-grid="schema.id" v-for="(column,index) in schema.columns">  
				<component v-for="field in column.fields" 
				 :key="field.id"
				 :is="field.type"
				 v-model="$root.$form.data[field.variable]"
				 :schema="field"></component>
			</div></div></cf_field>`,
        data: function () {
            if (this.schema.width === undefined) this.schema.width = 12;
            return {}
        },
        computed: {
        },
        props: ["value", "schema"],
    },

    editForm: {
        template: `<div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkShowSeparator" class="uk-form-label"><input id="chkShowSeparator" class="uk-checkbox" type="checkbox" v-model="showSeparator"/> Show separator</label>
                        </div>
                    </div>`,
        data: function () {
            return this.value;
        },
        props: ["value"]
    }
});


var textInput = {
    type: 'textField',
    display: 'Input field',
    acceptedVariableTypes:['text','number'],
    sanitizeSchemaModel: function (model) {
        if (!model) model = {};
        if (!model.label) model.label = '';
        if (!model.variable) model.variable = '';
        if (!model.placeholder) model.placeholder = '';
        return model;
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label><div class="uk-form-controls"><input :type="inputType" v-bind:class="{'uk-form-danger': this.$error}" :placeholder="schema.placeholder" class="uk-input uk-form-small" :id="schema.id" :value="value" @input="updateInput"></div><div class="error-message">{{this.$errorMessage}}&nbsp;</div></cf_field>`,
        data: function () {
            return {}
        },
        computed: {
            inputType: function () { return 'text'; }
        },
        methods: {
            updateInput: function () {
                this.$emit('input', this.$el.getElementsByTagName("input")[0].value)
                this.$touch();
            }
        },
        props: ["value", "schema"]
    },
    editForm: {
        template: `
                        <div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtLabel" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label" v-bind:class="{'uk-form-danger': $validation.label.$error}"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                   </div>`,
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        data: function () {
            return this.value;
        },
        props: ["value"]

    }
};

var passwordInput = extend(textInput, {
    type: 'passwordField',
    acceptedVariableTypes:['text']
});

//Lazy method for the password ;)
Object.assign(passwordInput.fieldTemplate.computed, { inputType: function () { return 'password'; } });
RegisterField(textInput);
RegisterField(passwordInput);


RegisterField({
    type: 'checkboxField',
    display: 'Decision field',
    acceptedVariableTypes:['text','number'],
    sanitizeSchemaModel: function (model) {
        if (!model) model = {};
        if (!model.label) model.label = '';
        if (!model.variable) model.variable = '';
        if (!model.checkedValue) model.checkedValue = 'OK';
        if (!model.uncheckedValue) model.uncheckedValue = 'NOK';
        return model;
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><div class=" uk-child-width-auto uk-grid"><label class="uk-form-label" :for="schema.id"><input type="checkbox" class="uk-checkbox" :id="schema.id" @input="updateInput" :checked="value===schema.checkedValue"> {{ schema.label }}</label></div><div class="error-message">{{this.$errorMessage}}&nbsp;</div></cf_field>`,
        data: function () {
            return {}
        },
        computed: {
            inputType: function () { return 'text'; }
        },
        methods: {
            updateInput: function () {
                this.$emit('input', (this.$el.getElementsByTagName("input")[0].checked ? this.schema.checkedValue : this.schema.uncheckedValue))
                this.$touch();
            }
        },
        props: ["value", "schema"]
    },
    editForm: {
        template: `
                        <div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtLabel" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label" v-bind:class="{'uk-form-danger': $validation.label.$error}"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtcheckedValue" class="uk-form-label">Value if checked</label>
                            <input id="txtcheckedValue" type="text" class="uk-input uk-form-small" v-model="checkedValue" v-bind:class="{'uk-form-danger': $validation.checkedValue.$error}"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtuncheckedValue" class="uk-form-label">Value if unchecked</label>
                            <input id="txtuncheckedValue" type="text" class="uk-input uk-form-small" v-model="uncheckedValue" v-bind:class="{'uk-form-danger': $validation.uncheckedValue.$error}"/>
                        </div>
                   </div>`,
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            },
            'checkedValue': {
                'required': window.validators.required,
            },
            'uncheckedValue': {
                'required': window.validators.required,
            }
        },
        data: function () {
            return this.value;
        },
        props: ["value"]

    }
});


RegisterField({
    type: 'richtextField',
    display: 'Richtext Field',
    acceptedVariableTypes:['richtext'],
    sanitizeSchemaModel: function (model) {
        if (!model) model = {};
        if (!model.label) model.label = '';
        if (!model.variable) model.variable = '';
        if (!model.placeholder) model.placeholder = '';
        return model;
    },
    fieldTemplate: {
        template:
            `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label>
                <div class="uk-form-control bt-select-field" v-bind:class="{'uk-form-danger': this.$error}">
  <div ref="quillToolbar">
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
    </span>
  </div>
	                <div ref="quillEditor"></div>
                </div>
                <div class="error-message">{{this.$errorMessage}}</div>
	        </cf_field>`,
        data: function () {
            return {};
        },
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        props: ["value", "schema"],
        mounted: function () {
            this.$quill = new Quill(this.$refs.quillEditor, {
                placeholder: this.schema.placeholder,
                readOnly: false,
                theme: 'snow',
                modules: {
                    toolbar: this.$refs.quillToolbar
                },
            });
            var quill = this.$quill;
            var t = this;
            quill.on('text-change', function (delta, oldDelta, source) {
                if (source === "user") {
                    var c = quill.getContents();
                    t.$emit('input', c);
                }
            });
            quill.on('selection-change', function (range, oldRange, source) {
                if (range === null && oldRange !== null) {
                    quill.container.classList.remove("ql-focus");
                } else if (range !== null && oldRange === null) {
                    quill.container.classList.add("ql-focus");
                }
            });
            quill.setContents(this.value, "api")
        },
        watch: {
            value: function (newValue, oldValue) {
                // update value
                if (JSON.stringify(newValue.ops) !== JSON.stringify(this.$quill.getContents().ops)) {
                    this.$quill.setContents(newValue, "silent");
                }
            }
        },
    },
    editForm: {
        template: `
                        <div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtLabel" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label" v-bind:class="{'uk-form-danger': $validation.label.$error}"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                   </div>`,
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        data: function () {
            return this.value;
        },
        props: ["value"]

    }
});


RegisterField({
    type: 'datetimeField',
    display: 'DateTime Field',
    acceptedVariableTypes:['datetime','datetimerange'],
    sanitizeSchemaModel: function (model) {
        if (!model) model = {};
        if (!model.label) model.label = '';
        if (!model.variable) model.variable = '';
        if (!model.placeholder) model.placeholder = '';
        if (typeof (model.timePicker) === 'undefined') model.timePicker = false;
        if (typeof (model.rangePicker) === 'undefined') model.rangePicker = false;
        return model;
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label><div class="uk-form-controls"><input type="text" v-bind:class="{'uk-form-danger': this.$error}" :placeholder="schema.placeholder" class="uk-input uk-form-small" ref="dtCtrl" :id="schema.id" :value="formattedValue" ></div><div class="error-message">{{this.$errorMessage}}&nbsp;</div></cf_field>`,
        data: function () {
            return {};
        },
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        props: ["value", "schema"],
        computed: {
            formattedValue: function () {
                var m = moment();
                var format = "l";
                if (this.schema.timePicker) format = "l LT";
                var v = "";
                if (this.value) {
                    if (this.value.start) {
                        v = v + moment(this.value.start).format(format);
                        if (this.schema.rangePicker && this.value.end) {
                            v = v + " - " + moment(this.value.end).format(format);
                        }
                    }
                }
                return v;
            }
        },
        methods: {
            build: function () {
                var locale = window.navigator.userLanguage || window.navigator.language;
                moment.locale(locale);
                var options = {
                    autoUpdateInput: false,
                    singleDatePicker: !this.schema.rangePicker,
                    timePicker: this.schema.timePicker,
                    timePicker24Hour: true,
                    autoApply: true,
                    locale: {
                        format: 'l LT',
                        separator: ' - ',
                        //    applyLabel: 'Apply',
                        //    cancelLabel: 'Cancel',
                        //    fromLabel: 'From',
                        //    toLabel: 'To',
                        //    customRangeLabel: 'Custom',
                        //    daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                        //    //monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        //    firstDay: 1
                    }
                };
                if (this.value) {
                    if (this.value.start) options.startDate = this.value.start;
                    if (this.value.end) options.endDate = this.value.end;
                }
                var t = this;
                this.$datetime = $(this.$refs.dtCtrl).daterangepicker(options,
                    function (start, end, label) {
                        t.$emit('input', { start: start, end: end });
                        console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')');
                    });
            }
        },
        mounted: function () {
            this.build();
            if (this.value && this.value.start) {
                $(this.$refs.dtCtrl).data('daterangepicker').setStartDate(this.value.start);
                if (this.value.end) {
                    $(this.$refs.dtCtrl).data('daterangepicker').setEndDate(this.value.end);
                }
            }
            this.$watch('schema', this.build, { deep: true });
        },
        watch: {
            value: function (newValue, oldValue) {
                // update value
                if (newValue && newValue.start) {
                    $(this.$refs.dtCtrl).data('daterangepicker').setStartDate(newValue.start);
                    if (newValue.end) {
                        $(this.$refs.dtCtrl).data('daterangepicker').setEndDate(newValue.end);
                    }
                }
            }
        },
    },
    editForm: {
        template: `
                        <div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtLabel" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label" v-bind:class="{'uk-form-danger': $validation.label.$error}"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkRangePicker" class="uk-form-label"><input id="chkRangePicker" class="uk-checkbox" type="checkbox" v-model="rangePicker"/> date range selection</label>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkTimePicker" class="uk-form-label"><input id="chkTimePicker" class="uk-checkbox" type="checkbox" v-model="timePicker"/> allow time selection</label>
                        </div>
                   </div>`,
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        data: function () {
            return this.value;
        },
        props: ["value"]

    }
});

RegisterField({
    type: 'selectField',
    display: 'Dropdown select',
    acceptedVariableTypes:['listitem','listitemarray'],
    sanitizeSchemaModel: function (model) {
        if (!model) model = {};
        if (!model.label) model.label = '';
        if (!model.variable) model.variable = '';
        if (!model.placeholder) model.placeholder = '';
        if (!model.minimumInputLength) model.minimumInputLength = 3;
        if (!model.sourceId) model.sourceId = '';
        if ((typeof (model.multiple) === 'undefined')) model.multiple = false;
        return model;
    },
    fieldTemplate: {
        template:
                `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label>
                <div class="uk-form-control bt-select-field" v-bind:class="{'uk-form-danger': this.$error}">
                    <select style="width:100%" @change="changeValue" class="bt-select-field no-autoinit uk-select" v-model="schema.id" :id="schema.id" :name="schema.id">
                    </select>
                </div>
                <div class="error-message">{{this.$errorMessage}}</div>
            </cf_field>`,
        data: function () {
            return {}
        },
        computed: {
        },
        props: ["value", "schema"],
        mounted: function () {
            this.buildSelect2();
            this.$watch('schema', this.buildSelect2, { deep: true })
        },
        methods: {
            changeValue: function (evt) {
                this.$emit('input', evt.srcElement.value)
            },
            buildSelect2: function () {
                var vm = this;
                var el = $(this.$el).find('select');
                           
                $.fn.select2.amd.require(['select2/data/array', 'select2/utils'], function (ArrayData, Utils) {
                    var RefAdapter = function($element, options) {
                        RefAdapter.__super__.constructor.call(this, $element, options);
                        this.datasource = vm.$root.getExternalDataSource(vm.schema.sourceId);
                        this.minimumInputLength = options.get('minimumInputLength');
                        this.loadMode = this.datasource.loadMode ?? 'once';
                    }
                    Utils.Extend(RefAdapter, ArrayData);
                    var cache = null;
                    RefAdapter.prototype.query = function (params, callback) {
                        params.term = params.term || '';

                        if (params.term.length < this.minimumInputLength) {
                          this.trigger('results:message', {
                            message: 'inputTooShort',
                            args: {
                              minimum: this.minimumInputLength,
                              input: params.term,
                              params: params
                            }
                          });
                    
                          return;
                        }


                    // CACHED
                    if(this.loadMode.toLowerCase() == 'once'){
                        var s = function(data, term){
                            return data.filter(obj=>term && obj.text.search(new RegExp(term, "i")) !== -1)
                        };
                        var f = function(results){
                            cache = results;
                            callback({results:s(cache, params.term)});
                        };
                        if(!cache){
                            vm.$root.getExternalData(vm.schema.sourceId, f, null);
                        }else
                        {
                            return callback({results:s(cache, params.term)});
                        }
                    }
                    // NOT CACHED
                    else if(this.loadMode.toLowerCase() == 'always'){

                        var f = function(results){
                            cache = results;
                            callback({results:results});
                        };
                        vm.$root.getExternalData(vm.schema.sourceId, f, params.term);
                        
                    } else {
                        this.trigger('results:message', {
                            message: 'Invalid loadMode',
                          });
                    }
                }


                    var sel2 = el.select2({
                        dropdownParent: $("#___formapp___"),
                        dataAdapter: RefAdapter,
                        placeholder: vm.schema.placeholder,
                        minimumInputLength: vm.schema.minimumInputLength,
                        multiple: vm.schema.multiple,
                        loadMode : 'always'
                    }) 
                    .val(vm.value)
                    .trigger("change")                    
                    .on("change", function (a,b,c) {
                        var val = null;    
                        if(this.multiple){
                            val = [];
                            for (let index = 0; index < this.selectedOptions.length; index++) {
                                const option = this.selectedOptions[index];
                                val.push({key : option.value, value : option.text});
                            }
                        }else{
                            if(this.selectedOptions.length>0){
                                var option = this.selectedOptions[0];
                                val = {key : option.value, value : option.text};
                            }
                        }
                        vm.$emit("input", val);
                    });

                    var data = {
                        id : 'BEL',
                        full_name : 'Belgique'
                    };

                    var option = new Option(data.full_name, data.id, true, true);
               
                    sel2.append(option).trigger('change');
                
                    // manually trigger the `select2:select` event
                    sel2.trigger({
                        type: 'select2:select',
                        params: {
                            data: data
                        }
                    });


                });
               
            
            }
        },
        watch: {
            value: function (value) {
                // update value
                $(this.$el)
                    .val(value)
                    .trigger("change");
            }
        },
        destroyed: function () {
            $(this.$el).find("select")
                .off()
                .select2("destroy");
        }
    },
    editForm: {
        template: `<div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="drpDataSource" class="uk-form-label">Data source</label>
                            <select class="uk-select uk-form-small" id="drpDataSource" v-model="sourceId">
                                <option v-for="option in dataSources" v-bind:value="option.id">
                                    {{option.text}}
                                </option>
                            </select>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkMultiple" class="uk-form-label"><input id="chkMultiple" class="uk-checkbox" type="checkbox" v-model="multiple"/> Allow multiple selection</label>
                        </div>
                    </div>`,
        validations: {
            'label': {
                'required': window.validators.required,
                'minLength': window.validators.minLength(3)
            }
        },
        computed:{
            dataSources : function(){
                return this.$root.datasources;
            }
        },
        data: function () {
            return this.value
        },

        props: ["value"]

    }
});








