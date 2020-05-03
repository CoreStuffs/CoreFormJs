Vue.component('cf_toolbutton', {
    template: `<div v-on:click="click()" :class="'toolbar-button ' + cssclass"><img :src="'./img/'+ icon +'.svg'"/></div>`,
    data: function () {
        return {}
    },
    props: ["onclick", "cssclass", "icon"],
    methods: {
        click: function (evt) {
            this.onclick();
        }
    }
});

Vue.component('cf_field', {
    template: `<div :data-ref="id" :type="type" class="cf_validationError sortable-item uk-margin-small-bottom"><div class="toolbar"><label v-if="variableText">Data: {{variableText}}</label><cf_toolbutton icon="move" cssclass="uk-drag moveHandle"/><cf_toolbutton icon="settings" :onclick="openSettings"/><cf_toolbutton icon="trash" cssclass="deleteHandle" :onclick="removeNode"/></div><slot></slot></div>`,
    data: function () {
        return this.schema
    },
    computed: {
        variableText: function () {
            if (typeof (this.variable) !== "undefined") {
                return this.variable;
            }
            else {
                return "";
            }
        }
    },
    methods: {
        openSettings: function (evt) {
            this.$root.$form.openSettingsById(this.id);
        },
        removeNode: function (evt) {
            this.$root.$form.removeNodeById(this.id);
        }
    },
    props: ["schema", "validation"]
});




