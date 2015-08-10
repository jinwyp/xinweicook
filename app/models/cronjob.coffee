
module.exports =
  schema:
    name: String  # 定时任务名称
    isActivated : type: Boolean, default:false
    type : String # 任务类型
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

  statics:
    constantCronJobType : () ->
      type =
        addInventory : "addInventory"
        inventoryNotify : "inventoryNotify"
  methods: {}
  rest: {}
