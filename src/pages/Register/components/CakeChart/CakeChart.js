import './CakeChart.scss'
import React from "react";
import {useTranslation} from 'react-i18next'
import {Spin} from 'antd'
import Plot from "react-plotly.js";

const CakeChart = ({firstLoading, colorsCake}) => {
    const {t} = useTranslation()

    const data = [
        {title: t('messages.aml.riskCritical'), value: colorsCake.critical, color: '#000000'},
        {title: t('messages.aml.riskHigh'), value: colorsCake.high, color: '#d9534f'},
        {title: t('messages.aml.riskMedium'), value: colorsCake.medium, color: '#FE9F0C'},
        {title: t('messages.aml.riskLow'), value: colorsCake.low, color: '#fcdc6b'},
        {title: t('messages.aml.risk.N'), value: colorsCake.n, color: '#598756'},
        {title: t('messages.aml.notProcessed'), value: colorsCake.na, color: '#999'}
    ]

    const graphGenerator = (graphData) => {
        const values = graphData.map(x => x.value);
        const labels = graphData.map(x => x.title);
        const color =  graphData.map(x => x.color);

        const dataGraph = [{
            type: "pie",
            values: values,
            labels: labels,
            hoverinfo: "",
            textposition: "inside",
            textinfo: 'none',
            automargin: false,
            hole: .75,
            marker: {
                colors: color
            },
        },
        ]
        const layoutGraph = {
            showlegend: false,
            height: 126,
            width: 126,
            margin: {
                l: 4,
                r: 4,
                b: 4,
                t: 4,
            },
        }
        return (
            <Plot data={dataGraph} layout={layoutGraph} />
        )
    }

    return (
        <div className="cake">
            {firstLoading ?
                <div className="cake-is-loading">
                    <Spin spinning={true}/>
                </div>
                :
                <>
                    {graphGenerator(data)}
                    <span className="results-number">{colorsCake.total}</span>
                    <span className="results-label">{t('messages.aml.results')}</span>
                </>
            }
        </div>
    )
}

export default CakeChart;
