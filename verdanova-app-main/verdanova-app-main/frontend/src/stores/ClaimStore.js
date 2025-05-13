import { makeAutoObservable } from "mobx";

class ClaimStore {
  AllClaims = [];
  UserClaims = [];
  AdminClaims = [];

  constructor() {
    makeAutoObservable(this);
  }

  addClaim= (claim,id) => {
    this.AllClaims.push(claim);
    if(claim.createdBy === Number(id)) {
      this.UserClaims.push(claim);
    }
    if(claim.responsibleAdmin && claim.responsibleAdmin !== null) {
        if(claim.responsibleAdmin === Number(id)) {
            this.AdminClaims.push(claim);
          }
      }
  };

  removeClaim  = (id) => {
    this.AllClaims = this.AllClaims.filter(claim => claim.id !== id);
    this.UserClaims = this.UserClaims.filter(claim => claim.id !== id);
    this.AdminClaims = this.AdminClaims.filter(claim => claim.id !== id);
  };

  getClaims(claims) {
    this.AllClaims = claims;
  }

  getUserClaims(claims) {
    this.UserClaims = claims;
  }

    getAdminClaims(claims) {
    this.AdminClaims = claims;
  }

  editClaim = (id, updatedClaim) => {
    const index = this.AllClaims.findIndex(claim => claim.id === id);
    if (index !== -1) {
      this.AllClaims[index] = { ...this.AllClaims[index], ...updatedClaim };
    }
    const index2 = this.UserClaims.findIndex(claim => claim.id === id );
    if (index2 !== -1) {
      this.UserClaims[index2] = { ...this.UserClaims[index2], ...updatedClaim };
    }

    const index3 = this.AdminClaims.findIndex(claim => claim.id === id);
    if (index3 !== -1) {
      this.AdminClaims[index3] = { ...this.AdminClaims[index3], ...updatedClaim };
    }
  };

}

const claimStore = new ClaimStore();
export default claimStore;
