import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex, List } from 'antd-mobile';

import SignInDeHeader from '@/components/SignInDeHeader';
import { URL } from '@/api';
import Http from '@/utils/base';
import './index.less';

const Item = List.Item;

class HadSingInCourse extends Component {
	constructor(props) {
		super(props);
		this.state={
			id:this.props.match.params.id,
			auditionStudents:[],
			standardStudents:[],
			makeupStudents:[],
			courseDetail:[],
		}
	}

	componentDidMount() {
			const {id} = this.state;
			Http.ajax(`${URL.sign_detail}/${id}/sign-detail`, {}).then(res => {
				if (res.code == '0') {
					const data=res.data.lessonSchedule;
					const dataarray=res.data;
					const courseDetail={
						lessonEndTime:data.lessonEndTime,
						lessonStartTime:data.lessonStartTime,
						teacherName:data.teacherName,
						storeName:data.storeName,
					}
					this.setState({
						auditionStudents:dataarray.auditionStudents,
						standardStudents:dataarray.standardStudents,
						makeupStudents:dataarray.makeupStudents,
						courseDetail:courseDetail,
					})
				}
			});
		}


	render() {
		const {auditionStudents,standardStudents,makeupStudents,courseDetail}=this.state;
		return (
			<div className="hscourse-container">
				{
					courseDetail.length!=0&&<SignInDeHeader  DataArray={courseDetail} />
				}
				{/*<SignInDeHeader DataArray={courseDetail}  />*/}
				<List className="hsstudent-content">
					<Item className="hscourse-student">上课学员</Item>
					{
						standardStudents.map((item,index)=> {
							return (
								<Item 
									className="student-div"   key={index}
									thumb={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')}
									extra={item.studentSigned?<div className="hssg">出勤</div>:<div className="hssg out-sg">缺勤</div>} >
									{item.studentName}
								</Item>
							)
						})
					}
					
				</List>
				{makeupStudents.length>0&& <List className="hsstudent-content">
					<Item className="hscourse-student">补课学员</Item>
					{
						makeupStudents.map((item,index)=> {
							return (
								<Item 
									className="student-div"   key={index}
									thumb={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')}
									extra={item.studentSigned?<div className="hssg">出勤</div>:<div className="hssg out-sg">缺勤</div>} >
									{item.studentName}
								</Item>
							)
						})
					}
					
				</List>}
				{auditionStudents.length>0&&<List className="hsstudent-content">
					<Item className="hscourse-student">试听学员</Item>
					{
						auditionStudents.map((item,index)=> {
							return (
								<Item 
									className="student-div"   key={index}
									thumb={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')}
									extra={item.studentSigned?<div className="hssg">出勤</div>:<div className="hssg out-sg">缺勤</div>} >
									{item.studentName}
								</Item>
							)
						})
					}
					
				</List>}
			</div>
		)
	}
}

export default HadSingInCourse;