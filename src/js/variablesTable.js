Vue.component('cf_variableTable', {
    template:`<div class="uk-overflow-auto">
    <table class="uk-table uk-table-middle uk-table-divider uk-table-small">
        <thead>
            <tr>
                <th class="uk-table-small">Name</th>
                <th >Required</th>
                <th class="uk-table-shrink">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="variable in variables">
                <td class="uk-text-nowrap">
                    {{variable.name}}
                </td>
                <td class="uk-text-nowrap">
                    <span :v-if="variable.validations.filter(o=>o.type.toLowerCase()==='required').length>0" uk-icon="check"></span>
                </td>
                <td class="uk-text-nowrap">
                    <a href="" uk-icon="icon: pencil"></a>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3">
                    <button class="uk-button uk-button-default uk-button-small" @click="addVariable()">Add</button>
                </td>
            </tr>
        </tfoot>
    </table>
</div>`,
data: function () {
    return this.variables;
},
methods:{
    addVariable:function(){
        this.$parent.openVariableSettings();
    },
    changeRequired:function(e,v){
        if(e.srcElement.checked){
            v.validations.push({type:'required'});
        }else{
            v.validations=v.validations.filter(o=>o.type.toLowerCase()!=='required');
        }
    },
},
props:['variables']

});