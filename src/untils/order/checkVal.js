const obj = {}
export function getVal (data){ // 根据选中的质量指标类型确定考核指标取值（lf--硫分，sf--水分，hff--挥发分，hf--灰分，hrd--灰熔点）
    if (data.BQ_DWRZ_MIN || data.BQ_DWRZ_MAX) {
        obj.rz ="Qnet,ar"
    }
    if (data.BQ_KGJLF) {
        obj.lf = 'St,d'
    } else if (data.BQ_KGJQL) {
        obj.lf = 'St,ad'
    } else if (data.BQ_SDJLF){
        obj.lf = 'St,ar'
    } else {
        obj.lf = 'St,d'
    }
    if (data.BQ_QS) {
        obj.sf = 'Mt'
    } else if (data.BQ_SDJQS) {
        obj.sf = 'Mt,ar'
    } else if (data.BQ_NS) {
        obj.sf = 'Minh'
    }else {
        obj.sf = 'Mt'
    }
    if (data.BQ_GZWHJHFF_MIN || data.BQ_GZWHJHFF_MAX) {
        obj.hff = 'Vdaf'
    } else if (data.BQ_KGHF_MIN || data.BQ_KGHF_MAX) {
        obj.hff = 'Vad'
    } else if (data.BQ_SDJHFF_MIN || data.BQ_SDJHFF_MAX) {
        obj.hff = 'Var'
    } else {
        obj.hff = 'Vdaf'
    }
    if (data.BQ_HFAD_MAX || data.BQ_HFAD_MIN) {
        obj.hf = 'Ad'
    } else if (data.BQ_KQGZJHF) {
        obj.hf = 'Aad'
    } else if (data.BQ_HF_MIN || data.BQ_HF_MAX) {
        obj.hf = 'Aar'
    } else {
        obj.hf = 'Ad'
    }
    if (data.BQ_HRD) {
        obj.hrd = 'ST'
    } else if (data.BQ_HRDDT) {
        obj.hrd = 'DT'
    } else if (data.BQ_HRDFT) {
        obj.hrd = 'FT'
    } else {
        obj.hrd = 'ST'
    }
    return obj
}
