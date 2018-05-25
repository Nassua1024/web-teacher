import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Flex } from 'antd-mobile';

import { URL } from '@/api';
import { addItem } from '@/utils';
import Http from '@/utils/base';
import './index.less';

@withRouter
class CourseSignIn extends Component {
	constructor(props) {
		super(props);
		// console.log(this.props.match.params.id)
		this.state = {
			type: this.props.match.params.id,
			notSignedLessonList:[],
			SignedLessonList:[],
		};
	}

	componentWillMount() {
		document.title = '签到销课';	
		Http.ajax(URL.signed_lessons, {}).then(res => {
			if (res.code == '0') {
				const data=res.data;
				this.setState({
					notSignedLessonList:data.notSignedLessonList,
					SignedLessonList:data.signedLessonList
				})
			}
		});
	}

	componentDidMount() {
		addItem('makeup', { date: '', time: '', startTime: '', endTime: '', storeId: '', classroomId: '', courseId: '', students: [] });
	}

	handleChangeType = (type) => {
		// console.log(type)
		this.props.history.push(`/coursesignin/${type}`);
		this.setState({ type });	
	}

	handleEditSign(val) {
		this.props.history.push(`/edcourse/${val}`);
	}
	handleSeeSign(val) {
		this.props.history.push(`/dscourse/${val}`);
	}

	render() {
		const _this=this;
		const { type,notSignedLessonList,SignedLessonList} = this.state;
		return (
			<div className="csignin-container">
				<div className="course-operat">
					<Flex justify="around" className="operat-title">
						<div className={type == 0 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(0)}>待签到</div>
						<div className={type == 1 ? 'operat active' : 'operat'} onClick={() => this.handleChangeType(1)}>已签到</div>
					</Flex>	
				</div>
				<div className="csignin-list">
					<div className="course-wait">
						{type=='0'&&notSignedLessonList.map(function(item,index){
									return(
											<div onClick={() => _this.handleEditSign(item.lessonScheduleId)} key={index}>
												<div className="ccircle"><i></i></div>
												<div>
													<i></i>
													<div className="course-des">
														{
															item.makeup ? <p>补课</p> : 
																<p>{item.courseName}第{item.lessonSequeence}次课</p>
														}
														<span>{new Date(item.lessonStartTime).Format('hh:mm')} - {new Date(item.lessonEndTime).Format('hh:mm')}</span>
													</div>
												</div>
											</div>
										)
								})
						 }
						{type=='1' && SignedLessonList.map(function(item,index){
								if(item.marketLesson){
									return(
											
										 <div className="old"  onClick={() => _this.handleSeeSign(item.lessonScheduleId)} key={index}>
											<div className="ccircle"><i></i></div>
											<div>
												<i></i>
												<div className="course-des">
													{
														item.makeup ? <p>补课</p> : 
															<p>{item.courseName}第{item.lessonSequeence}次课</p>
													}
													<span>{new Date(item.lessonStartTime).Format('hh:mm')} - {new Date(item.lessonEndTime).Format(' hh:mm')}</span>
												</div>
											</div>
										</div>
									)
								}else{
									if(item.publichStatus){
										return(
												
											 <div className="old"  onClick={() => _this.handleSeeSign(item.lessonScheduleId)} key={index}>
												<div className="ccircle"><i></i></div>
												<div>
													<i></i>
													<div className="course-des">
														{
															item.makeup ? <p>补课</p> : 
																<p>{item.courseName}第{item.lessonSequeence}次课</p>
														}
														<span>{new Date(item.lessonStartTime).Format('hh:mm')} - {new Date(item.lessonEndTime).Format(' hh:mm')}</span>
													</div>
												</div>
											</div>
										)
									}else{
										return(
												<div onClick={() => _this.handleEditSign(item.lessonScheduleId)} key={index}>
													<div className="ccircle"><i></i></div>
													<div>
														<i></i>
														<div className="course-des">
															{
																item.makeup ? <p>补课</p> : 
																	<p>{item.courseName}第{item.lessonSequeence}次课</p>
															}
															<span>{new Date(item.lessonStartTime).Format('hh:mm')} - {new Date(item.lessonEndTime).Format('hh:mm')}</span>
														</div>
													</div>
												</div>
											)
									}
									
								}
								
							})}
						{ type=='0'? notSignedLessonList.length<1?  <div className="nodata">暂无待签到数据</div>:'':''}
						{ type=='1'? SignedLessonList.length<1?  <div className="nodata">暂无已签到数据</div>:'':''}
					</div>
				</div>			
			</div>
		)
	}
}

export default CourseSignIn;
