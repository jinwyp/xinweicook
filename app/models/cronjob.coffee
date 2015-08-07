
module.exports =
  schema:
    name: String  # 定时任务名称
    isActivated : type: Boolean, default:false
    value:
      type: String
      set: (value) ->
        JSON.stringify value
      get: (value) ->
        JSON.parse value
    logList:[
      isExecuted : type: Boolean, default:false
      message : String
      executedDate : type: Date, default: moment()
    ]
    dishList: [
      dishId : type: Schema.Types.ObjectId, ref: 'dish'
      quantity : Number
    ]



  statics: {}
  methods: {}
  rest: {}
