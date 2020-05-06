Vue.component('v-formrenderer', {
    template: `<div class="cs-cf" id="app" v-cloak>
                    <div class="uk-container">
                        <fieldset class="uk-fieldset">
                            <div class="uk-card uk-card-default uk-card-body">
                                <h3 class="uk-card-title">{{schema.title}}</h3>
                                <div id="formContainer" data-ref="root" class="nested-sortable uk-form-stacked" style="padding:10px;min-height:60px">
                                    <component v-for="field in schema.fields"
                                               :key="field.id"
                                               :is="field.type"
                                               :schema="field"
                                               v-model="data[field.variable]">
                                    </component>
                                </div>
                                <div class="uk-grid-collapse uk-child-width-1-2@m" uk-grid>
                                    <div>
                                        <small>version {{schema.formVersion}}</small>
                                    </div>

                                    <div style="text-align:right">
                                        <button @click="saveData()" class="uk-button uk-button-primary">Submit</button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        <ul uk-accordion="multiple: true">
                            <li>
                                <a class="uk-accordion-title" href="#">Data</a>
                                <div class="uk-accordion-content"><pre><code>{{ data }}</code></pre></div>
                            </li>
                        </ul>
                    </div>
                </div>
            `,
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
        submit: function () {
            this.$v.$touch();
        },
        saveData: function () {
            this.$v.$touch();
            if (!this.$v.$error) {
                this.$root.saveFormData(this.data, function (data) {
                    UIkit.modal.alert("Successfully saved");
                });
            }
        }
    },
    created: function () {
        // `this` est une r�f�rence � l'instance de vm

        for (let [key, value] of registeredFields.entries()) {
            this.$options.components[key] = value.fieldTemplate;
        }
        for (let [key, value] of Object.entries(this.$options.components)) {
            value.components = this.$options.components;
        }

        var urlParams = new URLSearchParams(window.location.search);
        var schemaId = urlParams.get('schemaid');
        if (schemaId !== null && typeof (schemaId) !== 'undefined' && schemaId !== "") {
            var app = this;

            $.ajax({
                url: "/Form/" + schemaId + "/schema",
                //url: "/builder/test.json?" + Date.now(),
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    app.schema = data;
                }
            });
        }


    }

});



