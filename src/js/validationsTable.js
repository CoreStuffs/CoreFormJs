Vue.component('cf_validationtable', {
    template:`
    <div class="uk-form-horizontal uk-margin-large">
        <fieldset class="uk-fieldset">
            <div class="uk-margin">
                <label for="chkRequired" class="uk-form-label"><input name="checkRequired" v-model="required" class="uk-checkbox" type="checkbox"> Required</label>
                <div class="uk-form-controls">
                </div>
            </div>
        </fieldset>
    </div>`,
data: function () {
    return { 
        variable : this.variable
    };
},
computed:{
    required: {
        get (){
            return this.variable && this.variable.validations && this.variable.validations.filter(o=>o.type.toLowerCase()==='required').length===1;
        },
        set (val){
            if(val){
                this.variable.validations.push({type:'required'});
            }else{
                this.variable.validations=this.variable.validations.filter(o=>o.type.toLowerCase()!=='required');
            }
            this.$emit('input', this.variable);
        }
    }
},
validation:function(){
    return {}
},
methods:{

    changeRequired:function(e){
        if(e.srcElement.checked){
            this.variable.validations.push({type:'required'});
        }else{
            this.variable.validations=this.variable.validations.filter(o=>o.type.toLowerCase()!=='required');
        }
        $emit('input', this.variable);
    },
},
props:['variable']

});