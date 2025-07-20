<template>
    <div ref="chartContainer" class="echarts-container"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import { ref, onMounted, onUnmounted, watch, defineProps } from 'vue';
import { debounce } from 'lodash'; // Make sure to 'npm install lodash' if you use this

const props = defineProps({
    uvIndex: { type: Number, default: 1.22 },
    primaryColor: { type: String, default: '#999' },
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
            center: ['50%', '70%'],
            radius: '90%',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 15,
            splitNumber: 5,
            itemStyle: {
                color: '#FFDF20'
            },
            progress: {
                show: true,
                width: 30
            },
            pointer: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    width: 30
                }
            },
            axisTick: {
                distance: -45,
                splitNumber: 5,
                lineStyle: {
                    width: 2,
                    color: props.primaryColor
                }
            },
            splitLine: {
                distance: -52,
                length: 14,
                lineStyle: {
                    width: 3,
                    color: props.primaryColor
                }
            },
            axisLabel: {
                distance: -20,
                color: props.primaryColor,
                fontSize: 20
            },
            anchor: {
                show: false
            },
            title: {
                show: false
            },
            detail: {
                valueAnimation: true,
                // width: '60%',
                lineHeight: 40,
                borderRadius: 8,
                offsetCenter: [0, '-15%'],
                fontSize: 40,
                fontWeight: 'bolder',
                formatter: (val) => val.toFixed(2),
                color: 'inherit'
            },
            data: [props.uvIndex]
        },
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
watch(() => props.uvIndex, (newUV) => {
    chartOptions.value.series[0].data[0] = newUV;
});
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