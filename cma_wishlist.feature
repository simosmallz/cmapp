Feature: <feature title>
  In order to <business value to an actor>
  An <actor> should have to <feature title>
  So that <feature description>

Feature: User (Issuer) visits site 
  In order to manage a change record
  A user (Issuer) should have to login to site 
  So that they can create change records 
  And manage (edit, delete) the change records 

Feature: User (Receiver) visits site 
  In order to view and approve a change record
  A user (Receiver) should have to login to site 
  So that they can view change records 
  And approve the change records 

Feature: User (Admin) visits site 
  In order to manage users
  A user (Admin) should have to login to site 
  So that they can create users 
  And manage (edit, delete) users 

Feature: Epic Story	
	In order to provide an effective change management application that efficiently help users keep track of changes made in their organisation
	
	A business should deliver an effective and easy to use change management site (change management application)
	And provide a secure login access for actors - issuer(staff), receiver(client) and admin
	
	So that issuers can log into the site
	And create change records
	And manage (edit, delete) change records
	And send change records for approval to receiver
	
	So that receiver can log into the site
	And view details about a posted change record
	And create approval members to approve or disapprove change record
	And send email to approval members
	And check change record as approved

	So that an admin can log into the site
	And create users (issuer, receiver)
	And manage (edit, delete) users

	
