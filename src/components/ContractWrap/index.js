import React, { Component } from 'react';
import { List, Toast } from 'antd-mobile';

const ContractWrap = (contracts, contract, changeCon) => {

	return (
		<div className="cl-list-content">
			{
				contracts.map((c, i) => {
					const active = (contract != null && c.contractNo == contract.contractNo) ? 'active' : '';

					return (
						<div className={`cl-content ${active}`} key={i} onClick={() => changeCon(c)} >
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
	)
}