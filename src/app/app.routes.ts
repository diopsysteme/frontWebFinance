import { Routes } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {TransactionHistoryComponent} from './transactions/transaction-history/transaction-history.component';
import {DepositComponent} from './transactions/deposit/deposit.component';
import {WithdrawalComponent} from './transactions/withdrawal/withdrawal.component';
import {TransferComponent} from './transactions/transfer/transfer.component';
import {BuyCreditComponent} from './transactions/buy-credit/buy-credit.component';
import {ContactsComponent} from './transactions/contacts/contacts.component';
import {RegisterComponent} from './register/register.component';
import {PhoneVerificationComponent} from './login/login.component';
import {AuthGuard} from './services/auth/auth.guard';
import {SecretCodeComponent} from './secret-key/secret-key.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
      canActivate: [AuthGuard],
    children: [
      { path: '', component: TransactionHistoryComponent },  // Page d'accueil avec historique des transactions
      { path: 'deposit', component: DepositComponent },
      { path: 'withdrawal', component: WithdrawalComponent },
      { path: 'transfer', component: TransferComponent },
      { path: 'buy-credit', component: BuyCreditComponent },
      { path: 'contacts', component: ContactsComponent }
    ]
  },
  { path: 'login', component: PhoneVerificationComponent },
  { path: 'enter-pin', component: SecretCodeComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' } // Redirection pour toute route non définie
];
