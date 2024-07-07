interface Translation {
    [key: string]: {
      [key: string]: string;
    };
  }

const translation: Translation = {
    "EN": {
        "compartilharCommunity": "ComPartilhar Community",
        "password": "Password",
        "submit": "Submit",
        "notifications": "Notifications",
        "no_notifications": "No notifications",
        "name": "Name",
        "Members": "Members",
        "mebers": "members",
        "message": "Message",
        "region": "Region",
        "state": "State",
        "show": "Show",
        "of": "of",
        "users": "Users",
        "leader": "Leader",
        "general": "General",
        "sponsorship": "Sponsorship",
        "authorized": "Authorized",
        "pendent": "Pendent",
        "warning": "Warning",
        "cancel": "Cancel",
        "confirm": "Confirm",
        "seeProfile": "Profile",
        "profile": "Profile",
        "admin": "Admin",
        "group": "Group",
        "phoneNumber": "Phone Number",
        "email": "Email",
        "linkWhatsApp": "WhatsApp Link",
        "generalInfo": "General Information",
        "notFilled": "Not filled",
        "profession": "Job",
        "age": "Age",
        "years": "years",
        "seconds": "seconds",
        "minutes": "minutes",
        "hours": "hours",
        "days": "days",
        "communitySponsorshipCourse": "Training course for Community Sponsorship",
        "aboutMe": "About me",
        "motivation": "Motivation",
        "birthdate": "Birthdate",
        "courseDone": "I already completed the course and I am ready to sponsor!",
        "courseDoing": "I'm currently doing the online training course",
        "complete": "Complete",
        "notComplete": "Not complete",
        "sponsorshipState.all": "All",
        "sponsorshipState.noGroup": "No sponsorship group",
        "sponsorshipState.lookingForGroup": "Looking for group",
        "sponsorshipState.hasGroup": "In a group",
        "groups": "Groups",
        "group.state": "Group State",
        "group.lookingForMembers": "Looking for members",
        "group.complete": "Complete",
        "group.state.notSponsoring": "Does not have a refugee group assigned yet",
        "group.state.sponsoring": "Is currently sponsoring a refugee group",
        "groups.subtitle": "Register your sponsorship group",
        "signUp.confirmPassword": "Confirm Password",
        "noResults": "No results found",
        "logOut": "Log Out",
        "signIn": "Sign In",
        "signUp": "Sign Up",
        "myPin": "My Pin",
        "markAsRead": "Mark as read",
        "search.name": "Search by name...",
        "search.state": "Search by state...",
        "communityLink": "Link to the community on WhatsApp",
        "communityText": "A community to boost community sponsorship",
        "generalModeration.title": "Add WhatsApp community link",
        "generalModeration.description.enterLink": "Enter the link for the community on WhatsApp. To get this link:",
        "generalModeration.description.instr1": "Go to the community on the WhatsApp account as admin",
        "generalModeration.description.instr2": "Click on the icon on the top right corner",
        "generalModeration.description.instr3": "Press 'Invite members'",
        "generalModeration.description.instr4": "Copy the link ('https://chat.whatsapp.com/...')",
        "groupsModeration.title": "Groups Registration",
        "groupsModeration.description": "Verify all sponsorship group registrations and approve or reject the requests. These groups must already exist in the CPR before being created on the platform.",
        "groupsModeration.emptyState": "No sponsorship group registration requests",
        "usersModeration.title": "Register new users",
        "usersModeration.description": "Upload a .csv file with only one column, corresponding to the list of emails of the users you want to register",
        "usersModeration.emptyState": "No authorized users.",
        "createGroupForm.title": "Create sponsorship group",
        "createGroupForm.emailsDisclaimer": "Emails must be separated by , and correspond to the users' emails",
        "createGroupForm.leaderDisclaimer": "Email must correspond to a member's email given in the field above",
        "createGroupForm.request.pendent": " Your request to create the sponsorship group was successfully submitted and is awaiting validation from the administrator. While waiting, you can continue to edit the group data.",
        "createGroupModal.header": "Create sponsorship group",
        "createGroupModal.accept": "Continue",
        "createGroupModal.decline": "Cancel",
        "createGroupModal.description": "To create a sponsorship group on the platform, the group must already be registered in CPR. If you haven't registered yet, you can do so through the link: ",
        "createGroupModal.inst1": "To create a sponsorship group, follow the next steps:",
        "createGroupModal.inst2": "1. Fill out the form with the group data",
        "createGroupModal.inst3": "2. Add the group's pin on the map (will only be visible to everyone after validation)",
        "createGroupModal.inst4": "3. Wait for the group to be validated by the administrator",
        "createGroupModal.inst5": "4. Click 'Continue' to fill out the group creation form",
        "editGroupForm.title": "Edit sponsorship group",
        "addEditGroupPinButton.text": "Drag the pin to the group's location",
        "addEditGroupPinButton.removePin": "Remove group pin",
        "addEditGroupPinButton.editPin": "Edit group pin",
        "addEditPinButton.text": "Drag the pin to your location",
        "addEditPinButton.removePin": "Remove pin",
        "addEditPinButton.editPin": "Edit my pin",
        "members.showMembersLookingForGroup": "Show members looking for a sponsorship group",
        "members.title": "Get to know your community",
        "editProfile": "Edit Profile",
        "editProfile.image": "Edit image",
        "editProfile.link": "Show direct link to WhatsApp to be contacted by other participants",
        "mainNav.map": "Map",
        "mainNav.groups": "Groups",
        "mainNav.members": "Members",
        "há": "",
        "ago": "ago",
        "success.addUsers": "Users were successfully added.",
        "success.removeUsers": "Users were successfully unregistered.",
        "success.addComunityLink": "Community link was successfully added.",
        "success.acceptGroupRequest": "Group request was accepted.",
        "success.rejectGroupRequest": "Group request was rejected.",
        "success.editGroupRequest": "Group was successfully updated.",
        "success.editPin": "Your pin has been updated.",
        "success.removePin": "Your pin has been removed.",
        "success.editGroupPin": "Your group pin has been updated.",
        "success.userProfileUpdated": "User profile successfully updated.",
        "success.createGroup": "Group was successfully added",
        "success.editGroup": "Group was successfully updated",
        "error.getAuthorizedEmails": "Error fetching authorized emails, please try again later.",
        "error.getGroupRequests": "Error fetching group requests, please try again later.",
        "error.unauthorized": "Unauthorized.",
        "error.invalidForm": "Invalid form.",
        "error.fileNotFound": "File not found.",
        "error.processingFile": "Error processing file.",
        "error.invalidFile": "Invalid file.",
        "error.emailsNotRegistered": "Some emails are not registered.",
        "error.leaderNotInMembers": "Leader email is not in the members list.",
        "error.userNotFound": "User not found."

    },
    "PT": {
        "compartilharCommunity": "Comunidade ComPartilhar",
        "password": "Palavra-passe",
        "submit": "Submeter",
        "notifications": "Notificações",
        "no_notifications": "Sem notificações",
        "name": "Nome",
        "Members": "Membros",
        "mebers": "membros",
        "message": "Mensagem",
        "region": "Região",
        "state": "Estado",
        "show": "Mostrar",
        "of": "de",
        "users": "Utilizadores",
        "leader": "Líder",
        "general": "Geral",
        "sponsorship": "Patrocínio",
        "authorized": "Autorizado",
        "pendent": "Pendente",
        "warning": "Aviso",
        "cancel": "Cancelar",
        "confirm": "Confirmar",
        "seeProfile": "Ver Perfil",
        "profile": "Perfil",
        "admin": "Admin",
        "group": "Grupo",
        "phoneNumber": "Telemóvel",
        "email": "Email",
        "linkWhatsApp": "Link para WhatsApp",
        "generalInfo": "Informação Geral",
        "notFilled": "Não preenchido",
        "profession": "Profissão",
        "age": "Idade",
        "years": "anos",
        "seconds": "segundos",
        "minutes": "minutos",
        "hours": "horas",
        "days": "dias",
        "communitySponsorshipCourse": "Curso de formação para Patrocínio Comunitário",
        "aboutMe": "Sobre mim",
        "motivation": "Motivação",
        "birthdate": "Data de Nascimento",
        "courseDone": "Já completei o curso e estou apto para ser patrocinador!",
        "courseDoing": "Estou a fazer o curso de formação online",
        "complete": "Completo",
        "notComplete": "Não completo",
        "sponsorshipState.all": "Todos",
        "sponsorshipState.noGroup": "Sem grupo de patrocínio",
        "sponsorshipState.lookingForGroup": "À procura de grupo",
        "sponsorshipState.hasGroup": "Pertence a um grupo",
        "groups": "Grupos",
        "group.state": "Estado do Grupo",
        "group.lookingForMembers": "À procura de membros",
        "group.complete": "Grupo completo",
        "group.state.notSponsoring": "Ainda não tem grupo de refugiados atribuído",
        "group.state.sponsoring": "Está a patrocinar um grupo de refugiados",
        "groups.subtitle": "Regista o teu grupo de patrocínio",
        "signUp.confirmPassword": "Confirmar Palavra-passe",
        "noResults": "Não foram encontrados resultados",
        "logOut": "Terminar Sessão",
        "signIn": "Entrar",
        "signUp": "Registar",
        "myPin": "O meu Pin",
        "markAsRead": "Marcar como lidas",
        "search.name": "Procurar por nome...",
        "search.state": "Procurar por estado...",
        "communityLink": "Link para a comunidade no WhatsApp",
        "communityText": "Uma comunidade para impulsionar o patrocínio comunitário",
        "generalModeration.title": "Adicionar link para comunidade no WhatsApp",
        "generalModeration.description.enterLink": "Insira o link para a comunidade no WhatsApp. Para obter este link:",
        "generalModeration.description.instr1": "Abra a comunidade no WhatsApp como administrador",
        "generalModeration.description.instr2": "Clique no ícone no canto superior direito",
        "generalModeration.description.instr3": "Pressione 'Convidar membros'",
        "generalModeration.description.instr4": "Copie o link ('https://chat.whatsapp.com/...')",
        "groupsModeration.title": "Registo de grupos",
        "groupsModeration.description": "Verifique todos os registos de grupos de patrocínio e aprove ou rejeite os pedidos. Estes grupos já devem existir no CPR antes de serem criados na plataforma.",
        "groupsModeration.emptyState": "Não existem pedidos de registo de grupos de patrocínio",
        "usersModeration.title": "Registar novos utilizadores",
        "usersModeration.description": "Carregar um ficheiro .csv com apenas uma coluna, correspondente à lista de e-mails dos novos utilizadores que quer registar",
        "usersModeration.emptyState": "Não existem utilizadores autorizados.",
        "createGroupForm.title": "Criar grupo de patrocínio",
        "createGroupForm.emailsDisclaimer": "Os emails devem ser separados por vírgulas e corresponder aos dos utilizadores",
        "createGroupForm.leaderDisclaimer": "O email deve corresponder ao de um membro dado no campo acima",
        "createGroupForm.request.pendent": " O seu pedido para a criação do grupo de patrocínio foi submetido com sucesso e está a aguardar validação do administrador. Enquanto aguarda, pode continuar a editar os dados do grupo.",
        "createGroupModal.header": "Criar grupo de patrocínio",
        "createGroupModal.accept": "Continuar",
        "createGroupModal.decline": "Cancelar",
        "createGroupModal.description": "Para criar um grupo de patrocínio na plataforma, é necessário que o grupo já esteja registado no CPR. Se ainda não efetuou o registo, pode fazê-lo através do link: ",
        "createGroupModal.inst1": "Para criar um grupo de patrocínio, siga os próximos passos:",
        "createGroupModal.inst2": "1. Preencha o formulário com os dados do grupo",
        "createGroupModal.inst3": "2. Adicione o pin do grupo no mapa (só será visível para todos após validação)",
        "createGroupModal.inst4": "3. Aguarde que o grupo seja validado pelo administrador",
        "createGroupModal.inst5": "4. Clique em 'Continuar' para preencher o formulário de criação do grupo",
        "editGroupForm.title": "Editar grupo de patrocínio",
        "addEditGroupPinButton.text": "Arraste o pin para a localização do grupo",
        "addEditGroupPinButton.removePin": "Remover pin de grupo",
        "addEditGroupPinButton.editPin": "Editar pin de grupo",
        "addEditPinButton.removePin": "Remover pin",
        "addEditPinButton.editPin": "Editar o meu pin",
        "addEditPinButton.text": "Arraste o pin para a sua localização",
        "members.showMembersLookingForGroup": "Mostrar membros à procura de grupo de patrocínio",
        "members.title": "Conhece a tua comunidade",
        "editProfile": "Editar Perfil",
        "editProfile.image": "Alterar imagem",
        "editProfile.link": "Mostrar link direto para o WhatsApp para poder ser contactado por outros participantes",
        "mainNav.map": "Mapa",
        "mainNav.groups": "Grupos",
        "mainNav.members": "Membros",
        "há": "Há",
        "ago": "",
        "success.addUsers": "Utilizadores registados com sucesso.",
        "success.removeUsers": "Utilizadores removidos com sucesso.",
        "success.addComunityLink": "Link da comunidade adicionado com sucesso.", 
        "success.acceptGroupRequest": "Pedido de grupo aceite.",
        "success.rejectGroupRequest": "Pedido de grupo rejeitado.",
        "success.editGroupRequest": "Grupo editado com sucesso.",
        "success.editPin": "O seu pin foi atualizado.",
        "success.removePin": "O seu pin foi removido.",
        "success.editGroupPin": "O pin do seu grupo foi atualizado.",
        "success.userProfileUpdated": "Perfil de utilizador foi atualizado com sucesso.",
        "success.createGroup": "Grupo foi adicionado com sucesso",
        "success.editGroup": "Grupo foi editado com sucesso",
        "error.getAuthorizedEmails": "Erro ao obter e-mails autorizados, por favor tente novamente mais tarde.",    
        "error.getGroupRequests": "Erro ao obter pedidos de grupo, por favor tente novamente mais tarde.",
        "error.unauthorized": "Não autorizado.",
        "error.invalidForm": "Formulário inválido.",
        "error.fileNotFound": "Ficheiro não encontrado.",
        "error.processingFile": "Erro a processar ficheiro.",
        "error.invalidFile": "Ficheiro inválido.",
        "error.emailsNotRegistered": "Alguns e-mails não estão registados.",
        "error.leaderNotInMembers": "O e-mail do líder não está na lista de membros.",
        "error.userNotFound": "Utilizador não encontrado."
    },
};

export default translation;