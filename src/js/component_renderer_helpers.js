Vue.component('cf_field', {
    template: `<div :data-ref="id" :type="type" class="sortable-item uk-margin-small-bottom"><slot></slot></div>`,
    data: function () {
        return this.schema
    },
    props: ["schema"]
});

