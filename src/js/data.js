var formData = {
    ctrl_1: 'Hello world',
    ctrl_2: 'bill@ms.com',
    ctrl_3: 2,
    ctrl_4: 2,
    ctrl_6: 3,
    ctrl_11: 'Hi!'
};


var formSchema = {
    'name' : 'FirstSchema',
    fields: [


        {
            'id': 'ctrl_1',
            'label': 'Name',
            'type': 'textField',
			'width': 12
        },
        {
            'id': 'ctrl_2',
            'label': 'Email',
            'type': 'textField',
			'width': 6
        },
        {
            'id': 'ctrl_3',
            'label': 'Movies',
            'type': 'selectField',
            'options': [
                { id: "1", text: "Aa" },
                { id: "2", text: "Bb" },
                { id: "3", text: "Cc" }
            ],
			'width': 6
        },
        {
            'id': 'ctrl_4',
            'label': 'Food',
            'type': 'selectField',
            'options': [
                { id: 1, text: "Aa" },
                { id: 2, text: "Bb" },
                { id: 3, text: "Cc" }
            ],
            'width': 6
        },
        {
            'id': 'ctrl_50',
            'type': 'grid',
            'columns': [
                {
                    'id': 'ctrl_51',
                    'width': '4',
                    'fields': [

                        {
                            'id': 'ctrl_11',
                            'label': 'Bof...',
                            'type': 'textField',
                            'width': '12'
                        },
                        {
                            'id': 'ctrl_6',
                            'label': 'Movies',
                            'type': 'selectField',
                            'options': [
                                { id: 1, text: "Gg" },
                                { id: 2, text: "Hh" },
                                { id: 3, text: "Ii" }
                            ],
                            'width':'12'
                        }]
                },
                {
                    'id': 'ctrl_52',
                    'width':'8',
                    'fields': [
                        {
                            'id': 'ctrl_7',
                            'label': 'Country',
                            'type': 'selectField',
                            'source': {
                                'id': 'Country123',
                                'minimumInputLength': 2
                            }
                            
                        }]
                }]
        }
    ]
};