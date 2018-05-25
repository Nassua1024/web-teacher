import React, { Component } from 'react';
import { List } from 'antd-mobile';
import Http from '@/utils/base';
import './index.less';
const Item = List.Item;

class SignInDeHeader extends Component{
	render(){
		const data=this.props.DataArray;
		const datenew=new Date(data.lessonStartTime).Format('yyyy年MM月dd日');
		const timer=new Date(data.lessonStartTime).Format('hh:mm') +' - '+new Date(data.lessonEndTime).Format('hh:mm');
		const week=new Date(data.lessonStartTime).getDay();
		const weeArray=["周日","周一","周二", "周三","周四","周五","周六"];
		const str=weeArray[week];
		return (
			<div className="sdheader-container">
			     <List className="my-list">
			        <Item className="teach" extra={data.teacherName}>授课老师</Item>
			        <Item className="store" extra={data.storeName}>上课地点</Item>
			        <Item className="time-item time" extra={ datenew+'  '+str+'  '+timer}>上课时间</Item>
			    </List>
			</div>
		)
	}
}

export default SignInDeHeader