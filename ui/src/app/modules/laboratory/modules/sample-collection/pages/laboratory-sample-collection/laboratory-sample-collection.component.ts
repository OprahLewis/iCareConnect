import { Component, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { Patient } from "src/app/shared/resources/patient/models/patient.model";
import { select, Store } from "@ngrx/store";
import { AppState } from "src/app/store/reducers";
import { getCurrentPatient } from "src/app/store/selectors/current-patient.selectors";
import { LabOrder } from "src/app/shared/resources/visits/models/lab-order.model";
import { getAllLabOrders } from "src/app/store/selectors";
import {
  getVisitLoadingState,
  getVisitLoadedState,
  getActiveVisit,
} from "src/app/store/selectors/visit.selectors";
import { SampleObject } from "../../../../resources/models";
import { getAllLabSamples } from "../../../../store/selectors/samples.selectors";
import { VisitObject } from "src/app/shared/resources/visits/models/visit-object.model";
import { getSpecimenSources } from "../../../../store/selectors/specimen-sources-and-tests-management.selectors";
import { take } from "rxjs/operators";
import { go, loadCurrentPatient } from "src/app/store/actions";
import { getAllPayments } from "src/app/store/selectors/payment.selector";
import { loadPatientPayments } from "src/app/store/actions/payment.actions";
import { SampleTypesService } from "src/app/shared/services/sample-types.service";
import { ActivatedRoute } from "@angular/router";
import { loadActiveVisit } from "src/app/store/actions/visit.actions";

@Component({
  selector: "app-laboratory-sample-collection",
  templateUrl: "./laboratory-sample-collection.component.html",
  styleUrls: ["./laboratory-sample-collection.component.scss"],
})
export class LaboratorySampleCollectionComponent implements OnInit {
  patient$: Observable<Patient>;
  labOrders$: Observable<LabOrder[]>;
  specimenSources$: Observable<any>;
  labDepartments$: Observable<any>;
  visitLoadedState$: Observable<boolean>;
  loadingVisit$: Observable<boolean>;
  samplesCollected$: Observable<SampleObject[]>;
  activeVisit$: Observable<VisitObject>;
  currentPatient: Patient;
  payments$: Observable<any>;
  patientId: string;
  visitId: string;
  containers$: Observable<any>;
  countOfSamplesToCollect: number = 0;
  constructor(
    private store: Store<AppState>,
    private sampleTypesService: SampleTypesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.patientId = this.route.snapshot.params["patientId"];
    this.visitId = this.route.snapshot.params["visitId"];
    this.store.dispatch(loadCurrentPatient({ uuid: this.patientId }));

    this.store.dispatch(loadActiveVisit({ patientId: this.patientId }));

    this.patient$ = this.store.select(getCurrentPatient);

    this.labOrders$ = this.store.select(getAllLabOrders);
    this.specimenSources$ = this.store.select(getSpecimenSources, {
      name: "Specimen sources",
    });
    this.labDepartments$ = this.sampleTypesService.getLabDepartments();
    // TODO: Find a better way to deal with sample containers
    this.containers$ = of([]);

    this.visitLoadedState$ = this.store.select(getVisitLoadedState);
    this.loadingVisit$ = this.store.select(getVisitLoadingState);
    this.samplesCollected$ =
      this.store.select(
        getAllLabSamples
      ); /**TODO: Filter samples collection for this patient */
    this.activeVisit$ = this.store.select(getActiveVisit);
    this.payments$ = this.store.select(getAllPayments);
  }

  onSaveSampleCollection(event) {
    this.patient$ = this.store.select(getCurrentPatient);

    this.labOrders$ = this.store.select(getAllLabOrders);
    this.specimenSources$ = this.store.select(getSpecimenSources, {
      name: "Specimen sources",
    });
    this.labDepartments$ = this.sampleTypesService.getLabDepartments();

    this.visitLoadedState$ = this.store.select(getVisitLoadedState);
    this.loadingVisit$ = this.store.select(getVisitLoadingState);
    this.samplesCollected$ =
      this.store.select(
        getAllLabSamples
      ); /**TODO: Filter samples collection for this patient */
    this.activeVisit$ = this.store.select(getActiveVisit);
    this.payments$ = this.store.select(getAllPayments);
  }

  onGetSamplesToCollect(count: number): void {
    this.countOfSamplesToCollect = count;
  }
}