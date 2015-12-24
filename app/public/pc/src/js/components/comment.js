import React from 'react'

var Comment = React.createClass({

    handleChange() {
        this.props.changeComment(this.refs.comment.value)
    },

    render() {
        return (
            <div className="comment-section">
                <div className="form-control-group">
                    <label htmlFor="comment">留言：</label>
                    <textarea ref="comment" onChange={this.handleChange} rows="1" autoComplete="off" id="comment"></textarea>
                </div>
            </div>
        )
    }
})

export default Comment