Vue.component('cf_variableTable', {
    template:`<div class="uk-overflow-auto">
    <table class="uk-table uk-table-middle uk-table-divider  uk-table-small">
        <thead>
            <tr>
                <th >Name</th>
                <th >Required</th>
                <th >Validations</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="variable in variables">
                <td class="uk-text-nowrap">
                    <input type="text" class="uk-input uk-form-small" v-model="variable.name"/>
                </td>
                <td class="uk-text-nowrap">
                    <input type="checkbox" class="uk-checkbox" @change="changeRequired($event,variable)"/>
                </td>
                <td class="uk-text-nowrap">
                    <a href="#" uk-icon="icon: plus-circle"></a>                    
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
        this.variables.push({name:'',validations:[]});
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