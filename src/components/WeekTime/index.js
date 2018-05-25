import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { weekMap } from '@/utils';
import './index.less';

class WeekTime extends Component {
	static defaultProps = {
        		weeks: []
   	 }

	constructor(props) {
		super(props);
		
		this.handleChangeDay = this.handleChangeDay.bind(this);
	}

	handleChangeDay(date) {
		this.props.callbackFn(date);
	}

	render() {
		const { weeks } = this.props;

		return (
			<div className="week-time">
				{
					weeks.map((w) => {
						const d = w.date.split('-');
						//const weeknds = (w.week == 0 || w.week == 6) ? 'weeknds' : '';
						const weeknds = '';

						if (w.select) {
							return (
								<div key={w.week} className={`current-day ${weeknds}`} onClick={() => this.handleChangeDay(w.date)} >
									<div></div>
									<span>{weekMap[w.week]}</span>
									<span className="t-day">{d[2]}</span>
									<span className="t-month">{d[1]}月</span>
								</div>
							)
						}

						return (
							<div key={w.week} className={weeknds} onClick={() => this.handleChangeDay(w.date)} >
								<span>{weekMap[w.week]}</span>
								<span className="t-day">{d[2]}</span>
							</div>
						)
					})	
				}				
			</div>
		)
	}
}

WeekTime.PropTypes = {
	weeks: PropTypes.array,
	callbackFn: PropTypes.func
}

export default WeekTime;