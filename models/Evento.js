const { Schema, model } = require('mongoose');

//este es el modelo que queremos enviar y recibir  
const EventoSchema = Schema({
    title: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    start: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
})
//modificar el json:
EventoSchema.method('toJSON', function(){
    //eliminamos de object estos dos elementos:
    const {__v,_id,...object} = this.toObject();
    //cambiamos el nombre de _id a id:
    object.id=_id;
    return object;

})

module.exports = model('Evento', EventoSchema);