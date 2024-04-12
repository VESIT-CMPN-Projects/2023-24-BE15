import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimService } from '../claim.service';
import { FormControl, FormGroup } from '@angular/forms';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';


@Component({
  selector: 'app-basic-details',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.css']
})
export class BasicDetailsComponent {
  uploadedFile1: any;
  constructor( private modalService: NgbModal, private claimService:ClaimService) { }
  uploadedFile!:any
  claim!:any
  policyNumberCheck=false
  insuranceID!:any
  checkBP=false
  checkSugar=false
  extractedMedicinesList!:any
  diagnosis=""
  rejectedMedicinesList!:any
  extractedMedicines=""
  rejectedMedicines=""
  active=1
  icons={
    faStethoscope:faStethoscope,
  }
  claimID!:any
  ngOnInit(): void {
 this.claimForm()
    // this.getClaimIDToReport()
  }
  open(content: any): void {
    
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }) 
      this.uploadFile() 
      this.active=0
  }
  verifyPolicyNumber(number:any){
    this.claimService.verifyPolicyNumber({"policyNumber":number}).subscribe((val:any)=>{
      console.log(val)
      if(val.insuranceId!=0) {
        this.policyNumberCheck=true
        this.insuranceID=val.insuranceId

      }
    })
  }
  claimForm(){
    this.claim=new FormGroup({
      policyNumber:new FormControl(),
      hospitalName:new FormControl(),
      doctorName:new FormControl(), 
      injuryDate:new FormControl(),
      dischargeDate:new FormControl(),
      diagnosis:new FormControl(),
      file:new FormControl(),
      
    })
 }

 selectFile(event:any){
  console.log(event.target.files)
  this.uploadedFile=(event.target.files[0])
  console.warn(this.uploadedFile.name)
  }

  selectFile1(event:any){
    console.log(event.target.files)
    this.uploadedFile1=(event.target.files[0])
    console.warn(this.uploadedFile1.name)
    this.claimService.uploadFile(this.uploadedFile1).subscribe((response:any)=>{
      this.extractCharges(this.uploadedFile1.name)
    })
  }
extractCharges(name:any){
  this.claimService.extractCharges(name).subscribe((response:any)=>{
console.log(response)
  })

}
uploadFile(){
  this.extractFile(this.uploadedFile.name)
  console.log(this.uploadedFile)
  this.claimService.uploadFile(this.uploadedFile).subscribe((response:any)=>{
    console.log(response.filename)
   
    this.uploadFileToDB()
  })
}
extractFile(fileName:any){
  this.claimService.extractFile(fileName).subscribe((response:any)=>{
    console.log(response)
    
    this.extractedMedicinesList =response.result
console.log(this.extractedMedicinesList);
    this.compareMedicines()
    


  })
}
compareMedicines(){
  this.claimService.compareMedicines(this.claim.value.diagnosis,this.extractedMedicinesList).subscribe((response:any)=>{

    if(response[0]=="All matched") {

    }
    else{
      this.rejectedMedicinesList=response

    }
    this.extractedMedicinesList = this.extractedMedicinesList.filter((medicine: any) => !this.rejectedMedicinesList.includes(medicine));
    this.getClaimID()
 
    
   
   
  })
}

getClaimID(){
  this.claimService.getClaimID({
  insuranceId:this.claim.value.policyNumber
  }).subscribe((response:any)=>{
        this.claimID=response.id
        console.log(this.claimID)
        this.addApprovedMedicines()
        this.addRejectedMedicines()
  })
}


addApprovedMedicines(){
 
  console.log(this.extractedMedicinesList)

  this.extractedMedicines=this.extractedMedicinesList.join(",")
  this.claimService.addApprovedMedicines({
    claimId:this.claimID,
    approvedMedicines:this.extractedMedicines
  }).subscribe(()=>{
       console.log("Done inserted medicines sahi wlo")
  })




}
addRejectedMedicines(){
 
  this.rejectedMedicines=this.rejectedMedicinesList.join(",")
   console.log(this.rejectedMedicines)
  this.claimService.addRejectedMedicines({
    claimId:this.claimID,
    rejectedMedicines:this.rejectedMedicines
  }).subscribe(()=>{
       console.log("Done inserted medicines sahi wlo")
       
  })
}
checkCheckBoxvalueSugar(event:any){
  console.log(event.target.checked)
  this.checkSugar=event.target.checked

}
checkCheckBoxvalueBP(event:any){
  console.log(event.target.checked)
  this.checkBP=event.target.checked

}

submitForm(){
  console.log(this.claim.value.diagnosis)
  if(this.checkBP==true) this.claim.value.diagnosis=this.claim.value.diagnosis+"+BP"
  if(this.checkSugar==true) this.claim.value.diagnosis=this.claim.value.diagnosis+"+Sugar"

 this.claimService.submitForm({
  insuranceId:this.insuranceID,
  nameOfHospital:this.claim.value.hospitalName,
  nameOfDoctor:this.claim.value.doctorName,
  dateOfInjury:this.claim.value.injuryDate,
  dateOfDischarge:this.claim.value.dischargeDate,
  diagnosis:this.claim.value.diagnosis,
  file:this.uploadedFile.name
 
 }).subscribe(()=>{
  console.log("aya")

}) } 
uploadFileToDB(){
  console.log(this.uploadedFile)
  this.claimService.uploadFileToDB(this.uploadedFile).subscribe(()=>{
    console.log("File upload hua")
    this.submitForm()
  })
}

getClaimIDToReport(){
  this.claimService.dataReport({policyNumber:81}).subscribe((response:any)=>{
    console.log(response)
  })
}

 generatePDF(): void {
  const data = document.getElementById('content');
  if (!data) {
    console.error("Content element not found.");
    return;
  }
  html2canvas(data).then(canvas => {
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF

    const imgWidth = 208;
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('new-file.pdf'); // Generated PDF
  });
}

}
