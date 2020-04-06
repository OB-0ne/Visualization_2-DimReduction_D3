//default state of second dropdown menu is none
d3.select("#dataset_ddm").style("display", "none");


//have a gloabl main DDM option
var DDM_main_selected;
var DDM_dataset_selected=0;

//Control the main dropdown
var ddm_but = d3.selectAll(".main_ddm_val");
//Dropdown Click functionality
ddm_but.on("click", function () {

    //Check and make the Secondary dropdown option
    if(d3.select(this).attr("sec_ddm") == "true"){
        d3.select("#dataset_ddm").style("display", "");
        d3.select("#dataset_ddm").text("Main Dataset");
    } else {
        d3.select("#dataset_ddm").style("display", "none");
    }

    //Update the selected option on menu
    d3.select("#main_ddm").text(this.text);

    //remove all SVGs
    removeAllSVG();

    //update the selected attribute
    DDM_main_selected = d3.select(this).attr("func");
    DDM_dataset_selected = 0;

    //call the mail controller to decide what function to call
    main_DDM_control();
    
});

var ddm_but_data = d3.selectAll(".dataset_ddm_val");
//Dropdown Click functionality
ddm_but_data.on("click", function () {

    //Update the selected option on menu
    d3.select("#dataset_ddm").text(this.text);

    //remove all SVGs
    removeAllSVG();

    //update the selected attribute
    DDM_dataset_selected = d3.select(this).attr("d_set");

    //call the mail controller to decide what function to call
    main_DDM_control();
    
});

function main_DDM_control(){
    //cases to handle the different outcomes
    switch(DDM_main_selected){
        case '1':
            make_ScreePlot();
            break;
        case '2':
            make_Top2PcaPlot();
            break;
        case '3':
            make_MDSPlot("Euc");
            break;
        case '4':
            make_MDSPlot("Rec");
            break;
        case '5':
            make_Top3AttrPlot();
            break;
    }
}


function removeAllSVG(){
    d3.selectAll("svg").remove();
}

//-----------------------------------------------------------------
//Functions for various charts
//-----------------------------------------------------------------

function make_ScreePlot(){

    //get the right data
    $.get('/get_scree_data', function(response){
        //call the right function
        d3_ScreePlot(response.dim, response.cumdim);
    });

}

function make_Top2PcaPlot(){

    //get the right data
    $.get('/get_top2cpa_data', function(response){
        //call the right function
        d3_ScatterPlot(response.data, "Original Data");
        d3_ScatterPlot(response.data_rand, "Random Sampled Data");
        d3_ScatterPlot(response.data_strat, "Startified Sampled Data");
    });

}

function make_MDSPlot(datatype){

    if(datatype=="Rec"){
        get_link='/get_mds_data/0'
    }else{
        get_link='/get_mds_data/1'
    }

    //get the right data
    $.get(get_link, function(response){
        //call the right function
        d3_ScatterPlot(response.data, "Original Data");
        d3_ScatterPlot(response.data_rand, "Random Sampled Data");
        d3_ScatterPlot(response.data_strat, "Startified Sampled Data");
    });

}

function make_Top3AttrPlot(){
    
    get_link = '/get_top3_data/' + DDM_dataset_selected

    $.get(get_link, function(response){
        //call the right function
        d3_ScatterPlot_Matrix(response.top3);
    });

}