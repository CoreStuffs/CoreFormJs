Vue.component('cf_variableTable', {
    template:`<div class="uk-overflow-auto">
    <table class="uk-table uk-table-middle uk-table-divider uk-table-small">
        <thead>
            <tr>
                <th class="uk-table-small">Name</th>
                <th >Type</th>
                <th >Required</th>
                <th class="uk-table-shrink">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="variable in variables">
                <td class="uk-text-nowrap uk-text-small">
                    {{variable.name}}
                </td>
                <td class="uk-text-nowrap uk-text-small">
                    {{variableType(variable.type)}}
                </td>
                <td class="uk-text-nowrap uk-text-small">
                    <span :v-if="variable.validations.filter(o=>o.type.toLowerCase()==='required').length>0" uk-icon="check"></span>
                </td>
                <td class="uk-text-nowrap uk-text-small">
                    <a @click="editVariable(variable)" uk-icon="icon: pencil"></a>
                </td>
            </tr>
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4">
                    <button class="uk-button uk-button-default uk-button-small" @click="addVariable()">Add</button>
                </td>
            </tr>
        </tfoot>
    </table>
</div>`,
data: function () {
    return { };
},
methods:{
    variableType:function(name){
        return this.$root.variableType(name);
    },
    addVariable:function(){
        this.$parent.openVariableSettings();
    },
    editVariable:function(variable){
        this.$parent.openVariableSettings(variable);
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