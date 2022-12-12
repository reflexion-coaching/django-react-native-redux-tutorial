# Tutoriel : Django-API, Redux-ToolKit Query et React Native

**En cours !**

Ce tutoriel illustre les principales interactions entre une base de données et une application.

La base de données est une base SQLite simple créée et reliée à l'application via le framework Django REST. L'application est écrite avec React Native.

La mise en place de l'API est fortement inspirée (pour ne pas dire copiée-collée) de l'excellent livre **Django for API** de William S. Vincent. Ouvrage que je recommande vivement !

## API et base de données

C'est parti ! Commençons par créer une petite API et une base de données grâce au framework Django REST. 

### Mise en place de l'environnement

La préparation de l'environnement se fait comme suit :

* création d'un dossier
* mise en place d'un environnement virtuel
* installation de django
* création d'un projet **django_project**
* démarrage du serveur

``` 
$ mkdir testAPI

$ cd testAPI

$ virtualenv env

$ source env/bin/activate

$ pip install django

$ django-admin startproject tutorial_project .

$ python manage.py runserver
```

N'appliquons pas immédiatement les mises à jour car nous allons configurer notre propre base de données utilisateurs. 

### Configuration de la table des utilisateurs

Créons une petite application chargé de configurer notre profil utilisateur :

```
$ python manage.py startapp accounts
```

Bien maintenant, nous ajoutons cette nouvelle application dans le fichier `tutorial_project/settings.py` :

```
# django_project/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Local
    "accounts.apps.AccountsConfig",  # new
]
```

Il est temps de créer un modèle d'utilisateur. Modifons le fichier `accounts/models.py` :

```
# accounts/models.py
from django.contrib.auth.models import AbstractUser 
from django.db import models

class CustomUser(AbstractUser):
    name = models.CharField(null=True, blank=True, max_length=100)
    age = models.IntegerField(null=True, blank=True)
```

Ensuite Mettons à jour `AUTH_USER_MODEL` dans le fichier `settings.py`. De base, `AUTH_USER_MODEL` pointe vers `auth.User` mais nous voulons qu'il soit égal à `accounts.CustomUser` :

```
# django_project/settings.py
AUTH_USER_MODEL  = "accounts.CustomUser"  # new
```

Maintenant, nous pouvons appliquer les migrations :

```
$ python manage.py makemigrations

$ python manage.py migrate

$ python manage.py createsuperuser # admin admin123
```

Super ! Une base de données SQLite a été créée avec plusieurs tables dont la table *accounts_customuser*.

L'une des force de Django est son interface d'administration des données (disponible à l'adresse http://127.0.0.1:8000/admin/). Pour le moment, l'administration de la base de données *customuser* n'est pas disponible. Pour y rémédier, ajoutons un formulaire dans le nouveau fichier `accounts/forms.py` :

```
# accounts/forms.py
from django.contrib.auth.forms import UserCreationForm, UserChangeForm 
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm): 
    class Meta(UserCreationForm):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ("name", "age")

class CustomUserChangeForm(UserChangeForm): 
    class Meta:
        model = CustomUser
        fields = UserChangeForm.Meta.fields
```

Il ne reste plus qu'à rajouter la table *customuser* dans la page d'administration en éditant le fichier `accounts/admin.py`:

```
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm 
from .models import CustomUser

class CustomUserAdmin(UserAdmin): 
    add_form = CustomUserCreationForm 
    form = CustomUserChangeForm 
    model = CustomUser
    list_display = [
        "email",
        "username",
        "name",
        "age",
        "is_staff",
    ]
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("name", "age")}),) 
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {"fields": ("name", "age")}),)

admin.site.register(CustomUser, CustomUserAdmin)
```

CQFD ! La table *customuser* est maintenant affichée dans notre page d'administration Django. 

### Configuration de la table "books"

Il est temps de créer une application spécifique aux livres (*books*) :

```
$ python manage.py startapp books
```

et on l'ajoute dans le fichier `settings.py` :

```
# django_project/settings.py
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Local
    "accounts.apps.AccountsConfig",
    "books.apps.BooksConfig",  # new
]
```

Ajoutons une nouvelle table `Book` dans notre base de données qui aura comme champ :

* title : une chaine de caractère
* author : l'auteur du poste qui est lié à la table `accounts.CustomUser`
* created_at : une date qui sera par défaut la date de création
* updated_at : une date qui sera par défaut la date de modification

Le fichier `books/models.py` devient :

```
# books/models.py
from django.conf import settings 
from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=50)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self): 
        return self.title
```

`author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)` implique que les livres seront liés aux utilisateurs grâce au champ `author`.

Appliquons les migrations :

```
$ python manage.py makemigrations

$ python manage.py migrate
```

On ajoute les libres dans l'administration de notre api (`books/admin.py`):

```
from django.contrib import admin 
from .models import Book

admin.site.register(Book)

```

http://127.0.0.1:8000/admin/ affiche désormais les livres : CQFD ! Construisons quelques instances de "Book" pour jouer via l'API du navigateur (http://127.0.0.1:8000/admin/books/book/add/)!

### Django REST Framework

Pour le moment, nous n'avons utilisé que Django. Il est temps de faire intervernir Django REST Framework afin de faciliter :

* le routage via **`urls.py`**
* la transformation des données en JSON via les **`serializers.py`**
* la logique des endpoints via les **`views.py`**

Installons Django REST Framework :

```
$ pip install djangorestframework
```

et ajoutons-le à la liste des applications (`settings.py`):

```
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 3rd-party apps
    "rest_framework",  
    # Local
    "accounts.apps.AccountsConfig", 
    "books.apps.BooksConfig",
]

REST_FRAMEWORK = {  # new
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}
```

### URLs

Commençons par mettre à jour le fichier `django_project/urls.py` qui contient la structure des urls du projet. Nous lui indiquons que les urls commençant par `api/v1` pointent vers les livres :

```
# django_project/urls.py
from django.contrib import admin
from django.urls import path, include # new

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("books.urls")),  # new
]
```

Une bonne pratique est de créer des versions de notre API. Maintenant, créons un fichier `books/urls.py` pour y classer les URLs relatives aux livres et utilisateurs :

```
# books/urls.py
from django.urls import path
from rest_framework.routers import SimpleRouter

from .views import BookViewSet, UserViewSet

router = SimpleRouter()
router.register("users", UserViewSet, basename="users")
router.register("books", BookViewSet, basename="books")

urlpatterns = router.urls
```

Pour le moment, notre API ne fonctionne pas car les vues et serializers n'ont pas encore été écrits. 

### Serializers

Non seulement, les serializers transforment les données en JSON mais ils offrent aussi la possibilité d'inclure ou d'exclure certains champs. Inscrivons toutes ces informations dans `books/serializers.py` :

```
# books/serializers.py
from django.contrib.auth import get_user_model # new
from rest_framework import serializers
from .models import Book


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            "id",
            "author",
            "title",
            "created_at",
        )
        model = Book

class UserSerializer(serializers.ModelSerializer): 
    class Meta:
        model = get_user_model() 
        fields = ("id", "username",)
```

Il nous reste à écrire les vues.

### Views

Les vues définissent le comportement des endpoints. Il existe un nombre non négligeable de classes de vues différentes. Pour faciliter et accélérer l'écriture de l'API, nous utiliserons les **Viewsets**. Les Viewsets implémentent automatiquement les opérations de lecture, modification, création et suppression de données sans avoir besoin de les écrire manuellement.

Le fichier `books/views.py` devient :

```
# posts/views.py
from django.contrib.auth import get_user_model
from rest_framework import viewsets

from .models import Book
from .serializers import BookSerializer, UserSerializer 

class BookViewSet(viewsets.ModelViewSet): 
    queryset = Book.objects.all() 
    serializer_class = BookSerializer

class UserViewSet(viewsets.ModelViewSet): 
    queryset = get_user_model().objects.all() 
    serializer_class = UserSerializer
```

Super ! testons si tout fonctionne en nous rendant à l'adresse http://127.0.0.1:8000/api/v1/users/ pour afficher la liste des utilisateurs et http://127.0.0.1:8000/api/v1/books/ pour afficher la liste des livres :)

### CORS 

La dernière chose à faire avant de développer l'application React Native est de mettre en place les autorisations pour les requêtes extérieures. Installons le package `django-cors-headers` :

```
$ pip install django-cors-headers
```

Modifions `django_project/settings.py` :

```
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # 3rd-party apps
    "rest_framework",  
    "corsheaders",  # new
    # Local
    "accounts.apps.AccountsConfig", 
    "books.apps.BooksConfig",
]

REST_FRAMEWORK = { 
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",  # new
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# new
ALLOWED_HOSTS = ['*']
```

Cette fois-ci, testons notre API avec curl :

```
$ curl -X GET http://127.0.0.1:8000/api/v1/books/

```
Excellent pour le moment, arrêtons-nous la pour le développement de l'API. Il est temps de passer à React-Native. 

```
$ cd ..

$ deactivate
```

## React Native et Redux-ToolKit 

**React Native** est un framework basée sur React permettant de créer des applications IOS et Android. **Redux-ToolKit** est une librairie JavaScript de gestion de l'état d'une application web. 

React Native sera utilisé pour créer l'interface de l'application tandis que Redux-ToolKit (et plus particulièrement, Redux-ToolKit Query) servira à effectuer des requêtes avec Django REST Framework et mettre les données reçues en cache. 

### Installation via Expo

Expo est une plate-forme facilitant la création d'application IOS, Android et web. Commençons donc par créer un nouveau projet React Native avec Expo et téléchargeons la librairie Redux-ToolKit:

```
$ npx create-expo-app testReactNative

$ cd testReactNative

$ npm install @reduxjs/toolkit
```

### Installation de React Native Debugger

Avant de lancer l'application, nous allons télécharger React Native Debugger (RND). RND est un debugger complet prenant en compte React Native mais aussi Redux. Le guide d'installation est disponible ici (https://github.com/jhen0409/react-native-debugger/blob/master/docs/getting-started.md) et ici (https://github.com/jhen0409/react-native-debugger)

Sous Mac, la commande est `brew install --cask react-native-debugger`. L'application est directement installée dans le dossier **Applications**.

### Android Studio 

**Ajouter un texte d'explications pour l'installation d'Android Studio**

Ouverture d'Android > "Device Manager" > start a device

### Ouverture de l'application 

Lançons l'application avec la commande `npm start` et choisissons **Android** (si c'est le cas). 

Sur notre faux téléphone ouvert par Android Studio, l'écran affiche : "Open up App.js to start working on your app!". L'application est bien connectée au faux téléphone. 

Ensuite, autorisons le "Debug Remote JS" dans le "Toggle Menu" (le menu s'affiche en tapand "m" en ligne de commande). Le debugger devrait s'ouvrir dans le navigateur avec comme URL http://localhost:19000/debugger-ui/. Le port est 19000. Fermons la page et lançons la commande :

```
open "rndebugger://set-debugger-loc?host=localhost&port=19000"
```

RND s'ouvre et affiche l'état de notre projet dans la console :) Si cela ne fonctionne pas directement, il faut éventuellement arrêter et relancer dans le "Debug Remote JS" dans le "Toggle Menu".

### Connexion avec l'API : requête GET

Les requêtes GET récupèrent des données de l'API pour les afficher à l'écran. Avant de commencer à coder, modifons un peu l'architecture des dossiers.

Au sein du dossier **testReactNative**, créons  deux dossiers : **src/features** et **src/reducers** :

```
$ mkdir src

$ mkdir src/features

$ mkdir src/reducers
```

Dans le dossier **features**, ajoutons deux sous-dossiers :

```
$ mkdir src/features/api

$ mkdir src/features/book
```

L'architecture basique du projet ressemble donc à :

* /testAPI
    * manage.py
    * /tutorial_project
    * /books
    * /accounts

* /testReactNative
    * App.js
    * /src
        * /features
            * /api
            * /book
        * /reducers
    

Le dossier `src/features/api` contient les fichiers avec le code Redux. Créons un nouveau fichier `src/features/api/bookSlice.js` et éditons-le :

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }),
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`,
    }),
  }),
})

export const { useGetListOfBooksQuery } = bookApi

```

**`createApi`** définit un ensemble de endpoints décrivant comment récupérer des données à partir d'un backend :

* `reducerPath` le nom de l'endroit où sera monté nos données dans le store (dans notre cas, `bookApi`)
* `baseQuery` est l'URL de base de chaque requête (i.e. `'http://10.0.2.2:8000/api/v1/'`)
* `endpoints` est une liste d'`endpoints`. Dans notre exemple, `books/` sera ajoutée à l'URL de base pour envoyer des requêtes à `'http://10.0.2.2:8000/api/v1/books/'`. 

Redux-ToolKit Query construit automatiquement des hooks utiles à l'utilisation des requêtes. Ici, la récupération des données se fera grâce à `useGetListOfBooksQuery` et sera utilisé dans le nouveau fichier `src/features/book/BookList.js` :

```
import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useGetListOfBooksQuery } from '../api/bookSlice'

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()

    let content

    if (isLoading) {
        content = <Text> Loading </Text>
    } else if (isSuccess) {
        content = <Text> Query works ! </Text>
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View>
            { content }
        </View>
    )
}
```

Pour le moment, l'application affiche :

* **Loading** pendant le téléchargement des données
* **Query works !** si la requête GET est un succès
* **Query doesn't work !** si la requête échoue

Seulement pour que les requêtes s'effectuent, il faut éditer le *store* de Redux avec le *reducer* créé dans `src/features/api/bookSlice.js`. Editons donc le fichier `src/reducers/store.js` :

```
import { configureStore } from '@reduxjs/toolkit';
import { bookApi } from '../features/api/bookSlice';

export const store = configureStore({
  reducer: {
    [bookApi.reducerPath]: bookApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(bookApi.middleware)
});
```
 Exellent ! Enfin, importons notre composant dans le fichier `App.js` et enveloppons notre application avec le store :

```
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { BookList } from "./src/features/book/BookList"
import { Provider } from 'react-redux';
import { store } from './src/reducers/store';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <BookList />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

(En cas d'erreur, il est possible que la solution soit d'installer à nouveau react-redux `npm install --save react-redux`).

Super ! **Query works !** s'affiche sur l'écran du téléphone émulé : la requête GET est un succès !

### Connexion avec l'API : requête POST

Les requêtes POST envoient des données au serveur afin de modifier la base de données. Nous allons créer un petit bouton qui enverra des requêtes POST à chaque fois que le bouton sera pressé. Les données envoyées seront les mêmes à chaque requête. Plus tard, nous ajouterons un formulaire afin de customiser les données envoyées au serveur. 

Modifons le fichier `src/features/api/bookSlice.js` :

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }), 
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`,
    }),
    addNewBook: builder.mutation({
      query: initialBook => ({
        url: 'books/',
        method: 'POST',
        body: initialBook
      })
    })
  }),
})

export const { useGetListOfBooksQuery, useAddNewBookMutation } = bookApi
```

Le nouveau hook `useAddNewBookMutation` est ensuite utilisé dans un nouveau fichier `src/features/book/BookPost.js` :

```
import React, { useState } from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useAddNewBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        marginTop: 30,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
});

export const BookPost = () => {

    const [title, setTitle] = useState('Le Machine learning avec Python !')
    const [authorId, setAuthorId] = useState(1)
    const [addNewBook, { isLoading }] = useAddNewBookMutation()

    const canSave = [authorId, title].every(Boolean) && !isLoading

    const onSaveBookClicked = async () => {
        if (canSave) {
            try {
                await addNewBook({ title, author: authorId }).unwrap()
                setTitle('')
                setAuthorId('')
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
    }

    return (
        <View style={styles.container}> 
            <Button
                onPress={onSaveBookClicked}
                title="Make a POST Request"
                color="#6495ed"
                accessibilityLabel="Make a POST Request by clicking this button"
            />
        </View>
    )
}
```

Ce composant servira à afficher un bouton qui enverra le titre d'un nouveau livre (ici, "Le Machine learning avec Python !").

Enfin ajoutons le nouveau bouton dans `App.js`:

```
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { BookList } from "./src/features/book/BookList"
import { BookPost } from './src/features/book/BookPost';

import { Provider } from 'react-redux';
import { store } from './src/reducers/store';

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <BookList />
        <BookPost />
        <StatusBar style="auto" />
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Et voilà :) A chaque fois que le bouton sera pressé, une nouvelle requête POST sera envoyée avec comme auteur "1" qui est l'identifiant de l'administrateur et comme titre "Le Machine learning avec Python !". La liste est toujours disponible à l'adresse http://127.0.0.1:8000/api/v1/books/. 

### Mettre à jour les données en cache

Améliorons `src/features/book/BookList.js` afin d'afficher la liste des livres :

```
import React from 'react';
import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import { useGetListOfBooksQuery } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        marginTop: 30,
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
});

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()

    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <Text style={styles.item}>Titre {item.id} : {item.title}</Text>} />
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View style={styles.container}>
            {content}
        </View>
    )
}
```

La liste des livres s'affichent désormais sur l'écran. Par-contre, elle ne se met pas à jour à chaque fois que le bouton de la requête POST est pressé. Mettons en place cette amélioration en ajoutant `tagTypes: ['Book']` à `src/features/api/bookSlice.js` :

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }), 
  tagTypes: ['Book'], //new
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`,
      providesTags: ['Book'] //new
    }),
    addNewBook: builder.mutation({
      query: initialBook => ({
        url: 'books/',
        method: 'POST',
        body: initialBook
      }),
      invalidatesTags: ['Book'] //new
    })
  })
})

export const { useGetListOfBooksQuery, useAddNewBookMutation } = bookApi
```

Les **tags** sont très utiles pour synchroniser la base de données avec l'application. 

### Connexion avec l'API : requête DELETE

Pour le moment, nous avons intégré des requêtes GET et POST. La requête suivant est DELETE. Le slice Redux devient :

```
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://10.0.2.2:8000/api/v1/' }), 
  tagTypes: ['Book'], 
  endpoints: builder => ({
    getListOfBooks: builder.query({
      query: () => `books/`,
      providesTags: ['Book'] 
    }),
    addNewBook: builder.mutation({
      query: initialBook => ({
        url: 'books/',
        method: 'POST',
        body: initialBook
      }),
      invalidatesTags: ['Book'] 
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/books/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Book'],
    }),
  })
})

export const { useGetListOfBooksQuery, useAddNewBookMutation, useDeleteBookMutation } = bookApi
```

Le hook `useDeleteBookMutation` sert à supprimer un livre de la base de données et le tag `invalidatesTags: ['Book']` met à nouveau à jour la liste des livres en cas de suppression d'une entrée. 

Ajoutons le bouton de suppression en-dessous de chaque titre de livre :

```
import React from 'react';
import { Text, View, Button, StyleSheet, FlatList } from 'react-native';
import { useGetListOfBooksQuery, useDeleteBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 22,
        marginTop: 30,
    },
    item: {
        padding: 10,
        marginTop: 30,
        fontSize: 18,
        height: 44,
        textAlign: 'center',
    },
});

export const BookList = () => {

    const { data, isLoading, isSuccess, isError, error } = useGetListOfBooksQuery()
    const [deleteBook, response] = useDeleteBookMutation()

    let content

    if (isLoading) {
        content = <Text> Loading ... </Text>
    } else if (isSuccess) {
        content = <FlatList data={data} renderItem={({ item }) => <View>
            <Text style={styles.item}>Titre {item.id} : {item.title}</Text>
            <Button onPress={() => deleteBook(item.id)} title="Delete Book" color="#6495ed"/> //new
        </View>} />
    } else if (isError) {
        content = <Text> Query doesn't work !</Text>
    }

    return (
        <View style={styles.container}>
            {content}
        </View>
    )
}
```

Excellent !

### Création de formulaire : Formik

Pour le moment, la requête POST ajoute systématiquement le même livre dans la base de données ( *Le Machine learning avec Python* avec comme auteur *admin*). Il serait intéressant de pouvoir rentrer un titre et le nom de l'auteur avant de soumettre la requête POST. La librairie Formik (https://formik.org/) est la librairie la plus utilisée pour la création de formulaire avec React Native. Téléchargeons-la :

```
$ npm install formik
```

En plus de formik, installons la librairie Yup qui servira à valider les données rentrées par l'utilisateur :

```
$ npm install yup
```

Bien, maintenant modifions le fichier `BookPost.js` :

```
import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput, Label } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { useAddNewBookMutation } from '../api/bookSlice'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        marginTop: 20,
    },
    formStyle: {
        padding: 24,
        borderWidth: 1,
        borderRadius: 10,
        borderRadius: 1,
    },
    inputStyle: {
        borderWidth: 1,
        borderColor: '#4e4e4e',
        padding: 12,
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 18,
    },
    inputLablel: {
        paddingTop: 10,
        fontSize: 18,
        height: 44,
        fontWeight: "bold",
    }
});


export const BookPost = () => {

    const [addNewBook, { isLoading }] = useAddNewBookMutation()

    const onSaveBookClicked = async (values) => {

        const canSave = [values.author, values.book].every(Boolean) && !isLoading

        if (canSave) {
            try {
                await addNewBook({ title: values.book, author: values.author }).unwrap()
            } catch (err) {
                console.error('Failed to save the post: ', err)
            }
        }
    }

    const MyReactNativeForm = props => (
        <Formik
            initialValues={{
                book: "Le Machine learning avec Python !",
                author: 1
            }}
            onSubmit={values => onSaveBookClicked(values)}
            validationSchema={Yup.object({
                book: Yup
                    .string()
                    .min(3, 'Must be 3 characters or less')
                    .required('Required'),
                author: Yup
                    .number("Must be more than 0")
                    .integer("Must be more than 0")
                    .required('Required'),
            })}
        >
            {({ handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid, }) => (
                <View style={styles.formStyle}>
                    <Text style={styles.inputLablel}>Book :</Text>
                    <TextInput
                        name="book"
                        placeholder='Add a new book'
                        onChangeText={handleChange('book')}
                        onBlur={handleBlur('book')}
                        style={styles.inputStyle}
                    />
                    {touched.book && errors.book &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.book}</Text>
                    }
                    <Text style={styles.inputLablel}>Author :</Text>
                    <TextInput
                        name="author"
                        placeholder='1'
                        onChangeText={handleChange('author')}
                        onBlur={handleBlur('author')}
                        value={values.author}
                        style={styles.inputStyle}
                    />
                    {touched.author && errors.author &&
                        <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.author}</Text>
                    }
                    <Button onPress={() => handleSubmit(values)} title="Submit" color="#6495ed" />
                </View>
            )}
        </Formik>
    );

    return (
        <View style={styles.container}>
            <MyReactNativeForm />
        </View>
    )
}
```

Nous avons défini "Le Machine learning avec Python !" et "1" pour valeurs initiales pour respectivement le titre et l'auteur du livre (`initialValues`). Ensuite, la librairie Yup nous a permis de définir les valeurs acceptées par le formulaire (`validationSchema`) : `title` est un `string` et `author` est un `integer`.

Un formulaire est créé et les erreurs de remplissage d'informations sont affichées (`{touched.book && errors.book && <Text style={{ fontSize: 16, color: '#FF0D10' }}>{errors.book}</Text>}`). 


### Connexion avec l'API : requête PUT

Bouton de modification à côté du bouton de suppression.

**A continuer : en cours !**