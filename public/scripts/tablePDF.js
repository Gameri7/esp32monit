var table_container = document.getElementById('table-container'),
            pdfout = document.getElementById('pdfout');
            pdfout.onclick = function(){
                var doc = new jsPDF('p', 'pt', 'a4',true); 
                var margin = 10; 
                var scale = (doc.internal.pageSize.width - margin * 15) / document.body.clientWidth; 
                var scale_mobile = (doc.internal.pageSize.width - margin * 15) / document.body.getBoundingClientRect(); 
                   
                if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
                    
                    doc.html(table_container, { 
                        x: margin,
                        y: margin,
                        html2canvas:{
                            scale: scale_mobile,
                        },
                        callback: function(doc){
                            doc.output('dataurlnewwindow', {filename: 'pdf.pdf'}); 
                        }
                    });
                } else{
                     
                    doc.html(table_container, {
                        x: margin,
                        y: margin,
                        html2canvas:{
                            scale: scale,
                        },
                        callback: function(doc){
                            doc.output('dataurlnewwindow', {filename: 'pdf.pdf'}); 
                        }
                    });
                }
            };