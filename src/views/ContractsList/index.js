import React, { Component } from 'react';
import { Button, Modal, Toast } from 'antd-mobile';

import { URL, context } from '@/api';
import Http from '@/utils/base';
import { addItem, getItem, formatDate } from '@/utils';
import './index.less';

import headimg from'@/assets/images/moren.png';

class ContractsList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: this.props.match.params.stuid,
			contracts:[],
			contract: null,
			modal: false	
		};
	}

	componentDidMount() {
		this.searchContracts();
	}

	searchContracts = () => {
		const _this = this;
		const data={
	        data:{
	            studentId: _this.state.id,
	            publicLesson: getItem('courseType') == 'PUBLIC' ? true : false
	        }
		}

		Http.ajax(`${URL.stu_contracts}`, data).then(res =>{
			if (res.code == '0') {
				_this.setState({
					contracts: res.data.contracts
				});
			}
		});
	}

	chooseStu = (contract) => {
		if (contract.lessonNotArragedCount <= 0) {
			Toast.info('不能选择剩余课程为零合同！', 1);
			return;
		}
		this.setState({ contract });
	}

	handleSave = () => {
		const { contract } = this.state;
		const { stuid, type } = this.props.match.params;


		if (contract == null) {
			Toast.info('请先选择一个合同！', 1);
			return;
		}

		if (type == 'normal') {
			this.setState({
				modal: true
			});
		} else {
			const makeup = getItem('makeup');
			const curstu = getItem('curstu');
			
			makeup.students.push({
				studentId: stuid,
				studentName: curstu.studentName,
				contractId: contract.contractId	
			});

			addItem('makeup', makeup);

			this.props.history.push(`/addmk`);
		}
	}

	addNewStu = (flag) => {
		const _this = this;
		const { id, contract } = this.state;
		const { lesId } = this.props.match.params;
		let promse = {
			method: 'POST',
			formData: false,
			data: {
				studentId: this.state.id,
				contractId: contract.contractId,
				permanent: flag
			}
		}

		Http.ajax(`${context}/lesson-schedules/${lesId}/transfer`, promse).then(res =>{
			if (res.code == '0') {
				Toast.info('添加成功！', 1);
				_this.setState({
					modal: false
				}, () => {
					this.props.history.push(`/edcourse/${lesId}`);
				});
			}
		});
	}

	render() {
		const { contracts, contract, modal } = this.state;

		return (
			<div className="cl-container">
				<h2>请选择合同</h2>
				{
					contracts.length > 0 &&
					<div className="cl-list-content">
						{
							contracts.map((c, i) => {
								const active = (contract != null && c.contractNo == contract.contractNo) ? 'active' : '';

								return (
									<div className={`cl-content ${active}`} key={i} onClick={() => this.chooseStu(c)} >
										<div>
											<span>学员：</span>
											<span>{c.studentName}</span>
										</div>
										<div>
											<span>订单号：</span>
											<span>{c.contractNo}</span>
										</div>
										<div>
											<span>签单日期：</span>
											<span>{formatDate(c.contractDate)}</span>
										</div>
										<div>
											<span>签订人：</span>
											<span>{c.ccName}</span>
										</div>
										<div>
											<span>总课时：</span>
											<span>{c.lessonCnt}</span>
										</div>
										<div>
											<span>剩余课时：</span>
											<span>{c.lessonNotArragedCount}</span>
										</div>
									</div>
								)
							})
						}
					</div>	
				}
				<div className="ButtonGroup">
					<Button  onClick={this.handleSave}>保存</Button>
				</div>
				<Modal
					className="clist-content"
			        visible={modal}
			        transparent
			        title={`请选择`}
			        onClose={() => this.setState({ modal: false })} >
		          	<div className="signin-content">
		         		<div className="btns">
		         			<Button 
		         				onClick={() => this.addNewStu(false)} >
		         				随堂上一次课
		         			</Button>
		         			<Button
		         				onClick={() => this.addNewStu(true)} >
		         				永久插班
		         			</Button>
		         		</div>
		          	</div>
			    </Modal>
			</div>
		)
	}
}

export default ContractsList;