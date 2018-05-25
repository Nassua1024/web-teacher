import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Flex, List,Button,Toast } from 'antd-mobile';

import SignInDeHeader from '@/components/SignInDeHeader';
import { URL } from '@/api';
import Http from '@/utils/base';
import {addItem, getItem, removeItem} from '@/utils/index';
import './index.less';

const Item = List.Item;
const mkup = getItem('makeup');

class EditSignInCourse extends Component {
	constructor(props) {
		super(props);
		// console.log(this.props.match.params.id)
		this.state={
			id:this.props.match.params.id,
			auditionStudents:[],
			standardStudents:[],
			makeupStudents:[],
			courseDetail:[],
			lessonStartTime:'',
		}

		this.addStu = this.addStu.bind(this);
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
					courseType: data.courseType,
					makeup: data.makeup
				}
				let otherpage=JSON.parse(getItem('buCourse')),newobj;
				removeItem('buCourse');
				if(otherpage==null){
					newobj=dataarray.makeupStudents
				}else{
					newobj =otherpage;
				}
				// if(dataarray.makeupStudents!=undefined){}
				
				// console.log(otherpage)
				// console.log(dataarray.makeupStudents)
				this.setState({
					lessonStartTime:data.lessonStartTime,
					auditionStudents:dataarray.auditionStudents,
					standardStudents:dataarray.standardStudents,
					makeupStudents:newobj,
					courseDetail:courseDetail,
				})
			}
		});
	}

	changeSignInType = (id) => {
		const {standardStudents}=this.state;
		var newArray=JSON.parse(JSON.stringify(standardStudents));
		newArray.map((item)=>{
			if(item.id==id){
				item.studentSigned=!item.studentSigned;
			}
		})
		this.setState({
			standardStudents:newArray
		})
	}

	handleDeletePic = (e,valid) => {
		e.stopPropagation();
		const {id,makeupStudents}=this.state;
		const items=JSON.parse(JSON.stringify(makeupStudents))
		for (var i=items.length-1; i>=0; i--){
			if(items[i].id==valid){
				 items.splice(i,1);
			}
		}


		this.setState({
			makeupStudents:items,
		})
	}
	addotherStu(){
		const {id,makeupStudents} = this.state;
		addItem('makeupStudents',makeupStudents)
		this.props.history.push(`/staddress/${id}`);
	}
	handleSave(){
		const _this=this;
		const {id,standardStudents,makeupStudents,lessonStartTime} = this.state;
		const Pinclass=(lessonStartTime-Date.now())/1000/60;
		console.log(Pinclass)
		if(Pinclass>30){
			 Toast.info('开课前30分钟不允许签到', 1.5);
			 return false;
		}
		const studentIds= standardStudents.map((item)=>{ 
			if(item.studentSigned==true){
				return item.id
			}
		})
		const makeupStudentIds= makeupStudents.map((item)=>{ return item.id})
		const newsdatas=studentIds.filter(function(val){
				    	return !(!val || val === "");
				  });
		let promse = {
			method: 'POST',
			formData:false,
			data: {
				lessonScheduleId: id,
				studentIds:newsdatas,
				makeupStudentIds,
			},
		}
		Http.ajax(`${URL.sign}/${id}/sign`, promse).then(res => {
			if (res.code == '0') {
				
				_this.props.history.push(`/coursesignin/1`);
 				mkup != null && removeItem('makeup');
			}
		})

	}
	addStu() {
		const { id, courseDetail } = this.state;

		addItem('courseType', courseDetail.courseType);
		this.props.history.push(`/searchstu/${id}/normal`);
	}
	render() {
		const { auditionStudents,standardStudents,makeupStudents,courseDetail } = this.state;

		return (
			<div className="hscourse-container escourse-container">
				{
					courseDetail.length!=0&&<SignInDeHeader  DataArray={courseDetail} />
				}
				<List className="hsstudent-content">
					<Item className="hscourse-student AttendClass">上课学员</Item>
					<div className="st-list">
						{
							standardStudents.map((item,index)=> {
								return (
									<div  key={index} className="st-groupdiv">
										<div className="st-div" onClick={() => this.changeSignInType(item.id)}>
											<img src={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')} alt="" />
											<div style={{'display': item.studentSigned?'none':'block'}}>缺勤</div>
										</div>
										<p>{item.studentName}</p>
									</div>
								)
							})
						}
						<div  className="st-groupdiv">
							<div className="st-div add-st" onClick={this.addStu}>
								<span className="plus icon "></span>
							</div>
							<p>添加学员</p>
						</div>
					</div>
				</List>
				{ 
				courseDetail.length != 0 && !courseDetail.makeup && 
				<List className="hsstudent-content">
					<Item className="hscourse-student changingCourse">补课学员</Item>
					<div className="st-list">
						{
							makeupStudents.map((item,index) => {
								return (
									<div  key={index} className="st-groupdiv">
										<div key={index} className="st-div">
											<img src={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')} alt="" />
											<i onClick={(e) => this.handleDeletePic(e,item.id)}></i>
										</div>
										<p>{item.studentName}</p>
									</div>
								)
							})
						}	
						<div  className="st-groupdiv">
							<div className="st-div add-st marbot30" onClick={this.addotherStu.bind(this)}>
								<span className="plus icon "></span>
							</div>
							<p>添加学员</p>
						</div>
					</div>
				</List>
				}
				{auditionStudents.length>0&&<List className="hsstudent-content">
					<Item className="hscourse-student Audition">试听学员</Item>
					<div className="st-list">
						{
							auditionStudents.map((item,index) => {
								return (
									<div  key={index} className="st-groupdiv">
										<div key={index} className="st-div">
											<img src={item.studentAvatar?item.studentAvatar:require('@/assets/images/test.png')} alt="" />
										</div>
										<p>{item.studentName}</p>
									</div>
								)
							})
						}	
					</div>
				</List>}

				<div className="ButtonGroup">
					{/*<Button type="primary" inline  onClick={this.handleCancel.bind(this)}>取消</Button>*/}
					<Button  onClick={this.handleSave.bind(this)}>保存</Button>
				</div>
			</div>
		)
	}
}

export default EditSignInCourse;