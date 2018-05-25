import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, List, Button } from 'antd-mobile';

import { URL } from '@/api';
import Http from '@/utils/base';
import {addItem, getItem, removeItem} from '@/utils/index';
import './index.less';

import headimg from'@/assets/images/moren.png'

const Item = List.Item;

class StudentAddress extends Component {
	constructor(props) {
		super(props);
    		this.state = {
    			id:this.props.match.params.id,
    			students:[],
    			AllChecked:'',
    		};
	}

	componentWillMount() {
		this.LoadData('')
	}

	componentWillUnmount() {}

	changeStudentName = (name) => {
		console.log(name);
	}

	cancleSearch = (str) => {
		this.LoadData(str)
	}
	onChangeChoose(e,id){
		const {students}=this.state;
		var num=0
		students.map((item)=>{
			if(item.id==id){
				item.checked=item.checked=='checked'?'':'checked'
			}
			if(item.checked=='checked'){
				++num;
			}
		})
		const AllChecked= num==students.length?'checked':'';
		console.log(students)
		this.setState({
			students,
			AllChecked
		})

	}
	onChangeAllChoose(){
		const {AllChecked,students}=this.state;
		const checked=AllChecked=='checked'?'':'checked';
		students.map((item)=>{
			item.checked=checked
		})
		this.setState({
			AllChecked:checked,
			students,
		})
	}
	searchStudent = (str) => {
		console.log(str);
	}
	handleCancel(){
		const {id}=this.state;
		this.props.history.push(`/edcourse/${id}`);
	}
	handleSave(){
		const {students,id}=this.state;
		const items=JSON.parse(JSON.stringify(students))
		for (var i=items.length-1; i>=0; i--){
			console.log(items[i].checked)
			if(items[i].checked==''||items[i].checked==undefined){
				items.splice(i,1);
			}
		}
		// console.log(items)
		addItem('buCourse',JSON.stringify(items));
		this.props.history.push(`/edcourse/${id}`);
		
	}
	LoadData(val){
		const {id} = this.state;
		const data={
		      method:'get',
		      formData:true,
		        data:{
		            lessonScheduleId:id,
		            studentName:val,
		        }
		}
		Http.ajax(`${URL.makeup}`, data).then(res => {
			if (res.code == '0') {
				const oldArrray = getItem('makeupStudents');
				removeItem('makeupStudents');
				const newArr= res.data.students;
				let num=0;
				if(oldArrray==null){
				 var newde=newArr.map(function( v,i) {
					      	v.checked ='';
					  })
				}else{
				             newArr.map(function( v,i) {
				                         if (newArr.length > 0) {
				                             for (var y = 0; y < oldArrray.length; y++) {
					                                 if (oldArrray[y].id == v.id) {
					                                     v.checked='checked';
					                                     ++num;
					                                 } else {
						                                     if (newArr[y].checked!='checked'|| newArr[y].checked==undefined) {
						                                          newArr[y].checked='';
						                                     }
					                                 }
				                             }
				                         } 
				              })
				}
				const AllChecked= num==newArr.length?'checked':'';
				this.setState({
					students:newArr,
					AllChecked
				})
			}
		});	
	}
	render() {
		const {students,AllChecked}=this.state;
		const _this=this;

		return (
			<div className="staddress-container">
				<SearchBar 
					placeholder="请输入学生姓名" 
					cancelText="搜索"
					showCancelButton={true}
					onCancel={this.cancleSearch}
					onChange={this.changeStudentName}
					onSubmit={this.searchStudent}
				/>
				{students.length>0&&<List className="sts-list">
					{
						students.map((item,index) => (
						          	<Item  key={index}
						          		/*thumb={item.studentAvatar?item.studentAvatar:headimg} >*/
						          		/*extra={<label className="ck"  htmlFor={item}><input type="checkbox" id={item.id}    name="student"  checked={item.checked} onChange={(e) => _this.onChangeChoose(e, item.id)} /></label>}*/
						          		/*thumb={<p><label className="ck"  htmlFor={item}><input type="checkbox" id={item.id}    name="student"  checked={item.checked} onChange={(e) => _this.onChangeChoose(e, item.id)} /></label></p> } >*/
						          		thumb={<span className="checkspan"><input type="checkbox" name="student"    id={item.id} checked={item.checked} onChange={(e) => _this.onChangeChoose(e, item.id)} / ><label  className="ck"  htmlFor={item.id} ></label></span> } >
						          		  
						          		<img src={item.studentAvatar?item.studentAvatar:headimg} /> {item.studentName}
						          	</Item>
				        		))
			       	 	}
				</List>}
				<p className="AllBox">
						<span className="checkspan"><input type="checkbox" name="student"    id="all" checked={AllChecked} onChange={(e) => _this.onChangeAllChoose(e)} / ><label  className="ck"  htmlFor="all"></label></span>	
							全部选中
				</p>
				<div className="buttonBox">
					<Button  inline className="addCencel"   onClick={this.handleCancel.bind(this)}></Button>
					<Button  className="addsubmit"  inline  onClick={this.handleSave.bind(this)}></Button>
				</div>
			</div>
		)
	}
}

export default StudentAddress;