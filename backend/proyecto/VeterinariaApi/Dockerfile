FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 10000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copiás todo desde la raíz del repo
COPY . .

# carpeta donde está el .csproj
WORKDIR /src/backend/proyecto/VeterinariaApi

# Restaurás y publicás
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "VeterinariaApi.dll", "--urls", "http://0.0.0.0:10000"]