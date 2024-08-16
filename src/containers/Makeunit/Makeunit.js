import React, { useState } from 'react';
import StepBar from '../../components/StepBar/StepBar';
import MaterialLibrary from '../../components/MaterialLibrary/MaterialLibrary';
import './Makeunit.css';
import FabricCanvas from "../../components/SketchBox/remake";

const Makeunit = (props) => {
    const { currentStep, handleNextStep, handlePrevStep, selectedMaterials, onAddMaterial, onSaveSketch,dataUrl,setDataUrl } = props;

    return (
        <div className="container">
            <div className="left-side">
                <StepBar currentStep={currentStep} handleNextStep={handleNextStep} handlePrevStep={handlePrevStep} />
                <div className="middle">
                    <div className="bgcolor">
                        <FabricCanvas setDataUrl={setDataUrl} dataUrl={dataUrl} /> {/* ����״̬����������� */}
                    </div>
                </div>
                <div className="unitbottom"></div>
            </div>
            <div className="right-side">
                <MaterialLibrary materials={selectedMaterials} onAddMaterial={onAddMaterial} />
            </div>

        </div>
    );
};

export default Makeunit;
