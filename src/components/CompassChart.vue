<template>
    <div ref="chartContainer" class="echarts-container"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue';
import { debounce } from 'lodash'; // Make sure to 'npm install lodash' if you use this

const props = defineProps({
    windDegree: { type: Number, default: 0 },
    windSpeed: { type: Number, default: 0 },
    primaryColor: { type: String, default: '#999' },
    secondaryColor: { type: String, default: '#FFDF20' }
});

// 1. Reactive reference for the chart container DOM element
const chartContainer = ref(null);

// 2. Reactive reference to hold the ECharts instance
const myChart = ref(null);

// 3. Define the chart options (can be reactive if needed, but often static or prop-driven)
const chartOptions = ref({
    series: [
        {
            type: 'gauge',
            center: ['50%', '50%'],
            radius: '110%',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 360,
            splitNumber: 12,
            itemStyle: {
                color: props.secondaryColor,
            },
            axisLine: {
                show: false,
            },
            pointer: {
                icon: 'arrow',
                length: '15%',
                offsetCenter: ['0%', '-50%'],
                width: 15,
                itemStyle: {
                    color: props.primaryColor
                }
            },
            axisTick: {
                length: 10,
                lineStyle: {
                    color: props.primaryColor,
                    width: 2
                }
            },
            splitLine: {
                length: 10,
                lineStyle: {
                    color: props.primaryColor,
                    width: 3.5
                }
            },
            axisLabel: {
                color: props.primaryColor,
                fontSize: 20,
                fontWeight: 'bold',
                distance: 12,
                overflow: 'break',
                color: '#FFDF20',
                formatter: (value) => {
                    if (value === 0) return 'N';
                    if (value === 90) return 'E';
                    if (value === 180) return 'S';
                    if (value === 270) return 'W';
                    return ''; // hide all other labels
                }
            },
            title: {
                offsetCenter: [0, '20%'],
                fontSize: 18,
            },
            detail: {
                fontSize: 30,
                offsetCenter: [0, 0],
                valueAnimation: true,
                color: props.secondaryColor,
                formatter: () => props.windSpeed,
            },
            data: [
                {
                    value: (props.windDegree - 180),
                    name: 'km/h',
                    color: '#FFDF20',
                }
            ]
        }
    ]
});

// 4. Function to initialize the chart
const initChart = () => {
    if (!chartContainer.value) {
        console.error("ECharts container not found in DOM.");
        return;
    }
    // Initialize ECharts instance on the DOM element
    myChart.value = echarts.init(chartContainer.value);
    // Set options
    myChart.value.setOption(chartOptions.value);
    // Initial resize call to ensure correct sizing after render
    myChart.value.resize();
};

// 5. Function to handle chart resizing (debounced for performance)
const handleChartResize = debounce(() => {
    if (myChart.value) {
        myChart.value.resize();
    }
}, 100); // Debounce by 100ms

// 6. Lifecycle Hook: On component mounted
onMounted(() => {
    initChart();
    // Attach event listener for window resize
    window.addEventListener('resize', handleChartResize);

    // OPTIONAL: Use ResizeObserver for more precise container resize detection
    // This is often better than window.resize if your container changes size
    // independently of the window (e.g., sidebar toggles).
    const resizeObserver = new ResizeObserver(() => {
        if (myChart.value) {
            myChart.value.resize();
        }
    });
    if (chartContainer.value) {
        resizeObserver.observe(chartContainer.value);
    }

    // Store the observer instance if you need to disconnect it later
    // For simplicity, we'll let it be garbage collected with the component for this example,
    // but explicitly disconnecting is good practice for complex scenarios.
    onUnmounted(() => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }
    });
});

// 7. Lifecycle Hook: On component unmounted
onUnmounted(() => {
    // Remove window resize listener
    window.removeEventListener('resize', handleChartResize);

    // Dispose of the ECharts instance to free up memory
    if (myChart.value) {
        myChart.value.dispose();
        myChart.value = null; // Clear the ref
    }
});

// OPTIONAL: Watch for changes in chartOptions (e.g., if passed as a prop)
// If chartOptions were a prop 'options' from the parent:
/*
const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
});

watch(() => props.options, (newOptions) => {
  if (myChart.value) {
    myChart.value.setOption(newOptions);
    myChart.value.resize(); // Resize after updating options
  }
}, { deep: true }); // Use deep: true if options object can have nested changes
*/
watch(
    () => [props.windDegree, props.windSpeed, props.primaryColor],
    ([newDegree, newSpeed, newPColor]) => {
        chartOptions.value.series[0].data[0].value = newDegree - 180;
        chartOptions.value.series[0].detail.formatter = () => newSpeed;
        if (myChart.value) {
            myChart.value.setOption(chartOptions.value, true); // true for notMerge, to force update
        }
    }
);
</script>

<style scoped>
.echarts-container {
    /* Crucial for responsiveness: */
    width: 100%;
    /* Take full width of parent */
    min-height: 250px;
    /* Minimum height for small screens */
    /* height: 350px; */
    /* Fixed height, or use aspect ratio */
    /* --- OR --- for aspect ratio: */
    /*
  height: 0;
  padding-bottom: 70%; // Creates a 10:7 aspect ratio (height is 70% of width)
  position: relative; // Needed for the chart's inner div if using padding-bottom
  */

    /* Optional styling for centering and max width */
    max-width: 900px;
    margin: 0 auto;
    /* border: 1px solid #eee; */
    /* Just for visualization */
}

/* If using padding-bottom for aspect ratio, make sure the EChart canvas fills it */
/*
.echarts-container > div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
*/
</style>