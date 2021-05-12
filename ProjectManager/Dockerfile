#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
RUN apt update
RUN apt install nodejs npm -y

WORKDIR /src
COPY ["ProjectManager.csproj", ""]
RUN npm install npm@latest -g
RUN dotnet restore "./ProjectManager.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "ProjectManager.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ProjectManager.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProjectManager.dll"]
