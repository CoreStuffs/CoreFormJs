﻿Vue.component('cf_editfieldmodal', {
    template: `<div :ref="editformId" :id="editformId" class="uk-flex-top" uk-modal v-cloak>
        <div class="uk-modal-dialog uk-margin-auto-vertical ">
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <!--<div class="uk-modal-header">
                <h2 class="uk-modal-title">Settings</h2>
            </div>-->
            <div class="uk-modal-body uk-form-stacked" id="editFormBody">
                <div>
                    <ul uk-tab>
                        <li><a href="#">Basic</a></li>
                        <li><a href="#">Debug</a></li>
                    </ul>
                    <ul class="uk-switcher uk-margin" uk-overflow-auto>
                        <li>
                            <div v-if="isDataField" class="uk-margin-small-bottom">
                                <label for="txtValue" class="uk-form-label">Name</label>
                                <input id="txtValue" type="text" class="uk-input uk-form-small" v-model="field.variable" v-bind:class="{'uk-form-danger': $v.field.variable.$error}"/>
                            </div>
                            <component :key="editformFieldId" :is="(field ? fieldType(field) : null)" v-bind="field" v-model="field"></component>
                        </li>
                        <li>
                            <pre><code>{{field}}</code></pre>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button class="uk-button uk-button-primary" type="button" @click="applyEdit()">Apply</button>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            editformId: Date.now(),
            editformFieldId: Date.now(),
            field: {},
            callback: function (obj) { }
        };
    },
    computed: {
        isDataField: function () {
            return this.field.type && registeredFields.get(this.field.type).isDataField;
        },
    },
    validations: function () {
        var v = this.$options.components['edit_' + this.field.type].validations;
        var obj = {
            field: {}
        };
        if (v) {
            for (let [key, value] of Object.entries(v)) {
                if (!key.startsWith("$")) obj.field[key] = value;
            }
        }
        if (this.isDataField) {
            obj.field.variable = {
                'required': required,
                'minLength': minLength(3)
            }
        };

        return obj;

    },
    mounted: function () {
        var el = $(this.$el).find('.variableSelector');
        el.select2()
            .val(this.field.variable)
            .trigger("change")
            // emit event on change.
            .on("change", function () {
                vm.$emit("input", $(this).val());
            });
    },
    watch: {
        field: function (evt) {
            this.$v.$reset();
        }
    },
    methods: {
        fieldType: function(field){
            if(!field || !field.type){
                alert(JSON.stringify(field));
                return;
            } ;
            return 'edit_' + field.type;
        },
        changeValue: function (evt) {
            this.$emit('input', evt.srcElement.value)
        },
        show: function (field, callback) {
            //ensure that data are not chached
            //this.editformId = Date.now();
            this.editformFieldId = Date.now();

            this.field = extend(field);
            this.callback = callback;

            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
                this.$options.components['edit_' + key] = value.editForm;
            }
            for (let [key, value] of Object.entries(this.$options.components)) {
                value.components = this.$options.components;
            }

            UIkit.modal(document.getElementById(this.editformId)).show();
        },

        applyEdit: function () {
            this.$v.$touch();
            if (!this.$v.$error) {
                UIkit.modal(document.getElementById(this.editformId)).hide();
                if (this.callback !== null && typeof (this.callback) !== 'undefined') {
                    var obj = extend(this.field);
                    this.callback(obj);
                }
            }

        },
    }
});

