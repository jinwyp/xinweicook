## Req

GET `/api/dishes?sideDishType=main&showForWarehouse=caohejing`

### GET Query params 参数


| Name             | Type     | Desc                              |
|:-----------------|:---------|:----------------------------------|
| sideDishType     | String   | 主菜还是配菜类型  主菜或配菜  main主菜 / topping浇头 / preferences菜属性 / drink饮料                   |
| showForWarehouse | String   | 默认不填 获取主仓库菜品 否则填写'caohejing1' 获取漕河泾仓库菜品           |






## Res
### Body




[Dish](../Dish)