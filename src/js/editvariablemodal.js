Vue.component('cf_editvariablemodal', {
    template: `<div :ref="editformId" :id="editformId" class="uk-flex-top" uk-modal v-cloak>
        <div style="transition: none;" class="uk-modal-dialog uk-transition-fade uk-margin-auto-vertical ">
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <!--<div class="uk-modal-header">
                <h2 class="uk-modal-title">Variable</h2>
            </div>-->
            <div class="uk-modal-body uk-form-stacked" id="editFormBody">
                <div>
                    <ul uk-tab>
                        <li><a href="#">Basic</a></li>
                        <li><a href="#">Debug</a></li>
                    </ul>
                    <ul class="uk-switcher uk-margin" uk-overflow-auto>
                        <li>
                            <div class="uk-margin-small-bottom">
                                <label for="txtValue" class="uk-form-label">Variable name</label>
                                <input id="txtValue" type="text" class="uk-input uk-form-small" v-model="variable.name" v-bind:class="{'uk-form-danger': $v.variable.name.$error}"/>
                            </div>
                            <div class="uk-margin-small-bottom">
                                <label for="selType" class="uk-form-label">Variable type</label>
                                <select v-if="(srcName==='')" name="selType" class="uk-select uk-form-small uk-width-expand@m" v-model="variable.type" v-bind:class="{'uk-form-danger': $v.variable.type.$error}">
                                    <option v-for="(text, key) in acceptedVariablesTypes" v-bind:value="key">
                                        {{ text }}
                                    </option>
                                </select>
                                <span v-if="(srcName!=='')" >{{variableType(variable.type)}}</span>
                            </div>
                        </li>
                        <li>
                            <pre><code>{{variable}}</code></pre>
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
            variable: {},
            callback: function (obj) { },
            srcName:'',
            acceptedVariablesTypes:{}
        };
    },
    validations:function(){
        return{
            variable: {
                name:{
                    'required':window.validators.required,
                    'alphaNum':window.validators.alphaNum,
                    'minLength':window.validators.minLength(3),
                    'unique': (value) => (
                        this.$root.$form.schema.variables.filter(o=>o.name.toLowerCase()==value.toLowerCase()).length === (this.srcName.toLowerCase()!==value.toLowerCase()?0:1) 
                        )
                },
                type:{
                    'required':window.validators.required
                }
            }
        }
    },
    mounted: function () {
        var el = $(this.$el).find('.variableSelector');
        el.select2()
            .val(this.variable)
            .trigger("change")
            // emit event on change.
            .on("change", function () {
                vm.$emit("input", $(this).val());
            });
    },
    watch: {
        variable: function (evt) {
            this.$v.$reset();
        }
    },
    methods: {
        variableType:function(name){
            return this.$root.variableType(name);
        },
        changeValue: function (evt) {
            this.$emit('input', evt.srcElement.value)
        },
        show: function (variable, acceptedTypes, callback) {
            if(!variable) variable = {name:'', validations:[{type:'required'}]};
            this.editformFieldId = Date.now();
            this.srcName = variable.name;
            this.variable = extend(variable);
            this.callback = callback;
           
            this.acceptedVariablesTypes={};
            for (const varid in this.$root.variableTypes){
                if(!acceptedTypes || acceptedTypes.filter(n=>n.toLowerCase()===varid.toLowerCase()).length===1){
                    this.acceptedVariablesTypes[varid]=this.$root.variableTypes[varid];
                }
            };
            if(Object.keys(this.acceptedVariablesTypes).length===1) this.variable.type=Object.keys(this.acceptedVariablesTypes)[0];
            
            UIkit.modal(document.getElementById(this.editformId)).show();
        },

        applyEdit: function () {
            this.$v.$touch();
            if (!this.$v.$error) {
                UIkit.modal(document.getElementById(this.editformId)).hide();
                if (this.callback !== null && typeof (this.callback) !== 'undefined') {
                    var obj = extend(this.variable);
                    var found = false;
                    this.$parent.schema.variables.forEach(variable => {
                        if(variable.name === this.srcName){
                            variable = obj;
                            found = true;
                            var t = this;
                            this.$root.$form.applyNodeModification(function(node){
                                if(node.variable && node.variable.toLowerCase() === t.srcName.toLowerCase()){
                                    node.variable = variable.name;
                                }
                            });
                        }
                    });
                    if(!found) this.$parent.schema.variables.push(obj);

                    this.callback(obj);
                }
            }

        },
    }
});

