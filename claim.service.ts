import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {

  constructor(private httpClient: HttpClient) { }

   verifyPolicyNumber(content:any):Observable<any>{
    console.log(content)
    return this.httpClient.post("http://localhost:8080/api/checkPolicyNumber",content )
  }

  submitForm(content:any):Observable<any>{
    return this.httpClient.post("http://localhost:8080/api/applyClaim",content)
  }

  uploadFile(file:File):Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<any>("http://localhost:8000/upload/",formData)
  }
  uploadFileToDB(file:File):Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post(`http://localhost:8080/api/uploadMedicineFile`,formData);
  }

  extractFile(fileName:any):Observable<any>{
    return this.httpClient.get("http://localhost:8000/add?pdf_path="+fileName)

  }
  extractCharges(fileName:any):Observable<any>{
    return this.httpClient.get("http://localhost:8000/amount?pdf_path="+fileName)

  }
  compareMedicines(diagnosis:any,medicinesList:any):Observable<any>{
    return this.httpClient.get("http://localhost:8000/compare/"+diagnosis+"?set_param="+medicinesList)
  }

  getClaimID(content:any){
    console.log(content)
    return this.httpClient.post("http://localhost:8080/api/getClaimId",content)
  }
  
  addApprovedMedicines(data:any){

return this.httpClient.post("http://localhost:8080/api/approvedMedicine",data)
  }
  addRejectedMedicines(data:any){
    console.log(data)
    return this.httpClient.post("http://localhost:8080/api/addRejectedMedicines",data)
      }

dataReport(data:any){
 return this.httpClient.get("http://localhost:8080/api/getDataForReport",data)
  
}
}
