import React from "react"

var EditingAddress = React.createClass({
    
    render() {
        var props = this.props
        return (
            <div className="editing-address">
                <div onClick={props.close} className="close fa fa-times"></div>
                <h5>{props.address._id ? '修改地址' : '添加新地址'}</h5>

                <div className="content">
                    <div className="form-field">
                        <label htmlFor="name">姓名</label>
                        <input type="text" id="name" placeholder="请填写您的姓名"/>

                        <div className="tips">
                            <span className="error">姓名不能少于2个字</span>
                        </div>
                    </div>
                    <div className="form-field error">
                        <label htmlFor="mobile">手机号</label>
                        <input type="text" id="mobile" placeholder="请填写您的手机号"/>

                        <div className="tips">
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="province">省,市,区</label>

                        <div className="select-group">
                            <select id="province">
                                <option value="上海">上海市</option>
                            </select>
                            <select>
                                <option value="上海">上海市</option>
                            </select>
                            <select>
                                <option value="上海">上海市</option>
                            </select>
                        </div>
                        <div className="tips">
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="street">街道</label>
                        <input type="text" id="street" placeholder="请填写您的街道地址"/>

                        <div className="tips">
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="address">楼层,门牌号</label>
                        <input type="text" id="address" placeholder="请填写您的楼层,门牌号"/>

                        <div className="tips">
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <button>保存</button>
                    <button>取消</button>
                </div>
            </div>
        )
    }
})

export default EditingAddress