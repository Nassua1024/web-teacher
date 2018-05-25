import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, List, Button, Toast } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import {addItem, getItem, removeItem} from '@/utils/index';
import './index.less';

import headimg from'@/assets/images/moren.png';

const Item = List.Item;

class SearchStudent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lesId: this.props.match.params.id,
			students:[]	
		};
	}

	searchStudent = (str) => {
		const _this = this;
		const { lesId } = this.state;
		const { type } = this.props.match.params;
		const idtype = type == 'normal' ? 'lessonScheduleId' : 'storeId';
		const url = type == 'normal' ? URL.seainter_stu : URL.makeup_stu;
		const ct = type == 'normal' ? {} : { courseType: getItem('courseType') };
		const data={
	        data:{
	            [idtype]: lesId,
	            studentName: str,
	            ...ct
	        }
		}

		Http.ajax(`${url}`, data).then(res =>{
			if (res.code == '0') {
				_this.setState({
					students: res.data.students
				});
			}
		})
	}

	chooseStu = (item) => {
		const { id } = item;
		const { lesId } = this.state;
		const { type } = this.props.match.params;
		const makeup = getItem('makeup');
		const double = makeup.students.find((stu) => stu.studentId == id);

		if (makeup.students.length != 0 && typeof double == 'object') {
			Toast.info('不能重复添加学生！', 1);
			return false;
		}

		addItem('curstu', item);
		this.props.history.push(`/contracts/${id}/${lesId}/${type}`);
	}

	render() {
		const { students } = this.state;

		return (
			<div className="ss-container">
				<SearchBar 
					placeholder="请输入学生姓名" 
					cancelText="搜索"
					showCancelButton={true}
					onCancel={this.searchStudent}
				/>
				{
					students.length > 0 && 
					<List className="sts-list">
						{
							students.map((item,index) => (
								<Item  key={index} arrow="horizontal" onClick={() => this.chooseStu(item)}>
						          	<img src={item.studentAvatar ? item.studentAvatar : headimg} /> {item.studentName}
						        </Item>
							))
						}
					</List>
				}
			</div>
		)
	}
}

export default SearchStudent;